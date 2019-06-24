import { eventChannel } from 'redux-saga';
import { call, cancelled, delay, fork, put, take, takeLatest } from 'redux-saga/effects';

import * as Actions from '@/actions';

import * as MetaWeather from '@/services/metaWeather';
import ReportModel from '@/services/database/reportModel';

const REPORT_TTL = 1000 * 60 * 60;

const reportsSubscription = (database, woeid) => {
  return eventChannel((emitter) => {
    console.log('listening to report', woeid);
    const onUpdate = (snapshot) => {
      try {
        const items = snapshot.map(i => ({ ...i, weather: i.weather.map(w => ({ ...w })) }));
        const report = items[0];
        emitter({ report });
      } catch (err) {
        console.log('Unable to emit snapshot', {
          snapshot,
          err,
        });
        emitter({ report: null });
      }
    };

    const target = database
      .objects(ReportModel.schema.name)
      .filtered('woeid == $0 LIMIT(1)', woeid)

    console.log('report.addListener');
    target.addListener(onUpdate);

    return () => {
      target.removeListener(onUpdate);
    };
  })
}

function *fetchWeather(database, woeid) {
  const result= yield call(
    MetaWeather.weather,
    woeid,
  );

  console.log('fetchWeather', result);

  try {
    console.groupCollapsed('report database.write');
    database.write(() => {
      console.log(result);
      ReportModel.create(database, result);
    });
  } catch (err) {
    console.log('unable to create result', err);
  } finally {
    console.groupEnd();
  }
}

function *subscribeToReport(database, woeid) {
  const channel = yield call(reportsSubscription, database, woeid);
  try {
    while (true) {
      const { report } = yield take(channel);
      console.log('report', report);

      const delta = report
        ? Date.now() - report.time.getTime()
        : REPORT_TTL + 1;

      if (report) {
        console.log('adding report', report);
        yield put(Actions.reportsAdd(report));
      }

      if (delta > REPORT_TTL) {
        console.log('updating report from API');
        yield call(fetchWeather, database, woeid);
      }
    }
  } catch (err) {
    console.log('subscribeToReport error', err);
  } finally {
    channel.close();
  }
}

export default subscribeToReport;
