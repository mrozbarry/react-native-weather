import { eventChannel } from 'redux-saga';
import { call, cancel, cancelled, fork, join, put, take, takeLatest } from 'redux-saga/effects';

import * as Actions from '@/actions';

import * as MetaWeather from '@/services/metaWeather';
import LocationModel from '@/services/database/locationModel';

import subscribeToReport from '@/sagas/report';

const locationsSubscription = (database, query) => {
  return eventChannel((emitter) => {
    const onUpdate = (snapshot) => {
      const collection = snapshot.length > 0
        ? snapshot.map(i => ({ ...i }))
        : [];

      emitter(collection);
    };

    const titleOrLattLong = query ? `*${query}*` : '*';
    const maybeId = query.split(' ').find(i => `${i}` === `${Number(i)}`)
    const woeid = maybeId ? Number(maybeId) : -1;

    const target = database
      .objects(LocationModel.schema.name)
      .filtered('(title LIKE $0 || latt_long LIKE $0 || woeid == $1) LIMIT(50)', titleOrLattLong, woeid)

    console.log('location.addListener');
    target.addListener(onUpdate);

    return () => {
      target.removeListener(onUpdate);
    };
  })
}

function *subscribeToLocations(database, query) {
  const channel = yield call(locationsSubscription, database, query);
  let forks = [];
  try {
    while (true) {
      const collection = yield take(channel);
      yield put(Actions.locationsIndex(collection, query));
      const forksCopy = [...forks];
      console.log('got locations', { collection, forks });
      for(const forked of forksCopy) {
        const forkIndex = forks.findIndex(f => f.woeid === forked.woeid);
        const isInCollection = collection.some(l => l.woeid === forked.woeid);

        if (!isInCollection) {
          console.log('dropping fork', forked);
          yield cancel(fork.handle);
          forks.splice(forkIndex, 1);
        }
      }
      for(const location of collection) {
        const isInForks = forks.find(f => f.woeid === location.woeid);
        console.log('checking for fork', { location, forks, isInForks });

        if (!isInForks) {
          console.log('forking for', location);
          const handle = yield fork(subscribeToReport, database, location.woeid);
          forks.push({
            handle,
            woeid: location.woeid,
          });
        }
      }
    }
  } catch (err) {
    console.log('subscribeToLocations error', channel, err);
  } finally {
    for(const fork in forks) {
      yield cancel(fork.handle);
    }
    channel.close();
  }
}

function *fetchLocation(database, action) {
  if (!action.query) {
    return;
  }

  let resultLocations = [];

  try {
    resultLocations = yield call(
      MetaWeather.search,
      action.query,
    );
  } catch (err) {
    return;
  }

  if (resultLocations.length === 0) {
    return;
  }

  console.groupCollapsed('locations database.write');
  database.write(() => {
    resultLocations.forEach((location) => {
      console.log(location);
      LocationModel.create(database, location);
    });
  });
  console.groupEnd();
}

function *searchLocation(database, action) {
  const handle = yield fork(
    subscribeToLocations,
    database,
    action.query,
  );
  try {
    yield call(fetchLocation, database, action);
    yield join(handle);
  } catch (err) {
    console.log('Error searching location', err);
  } finally {
    if (yield cancelled()) {
      handle.cancel();
    }
  }
}

export default function *(database) {
  yield takeLatest(Actions.LOCATIONS_FETCH, searchLocation, database);
}
