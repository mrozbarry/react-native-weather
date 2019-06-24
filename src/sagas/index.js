import createSagaMiddleware from 'redux-saga';
import { call } from 'redux-saga/effects';

import locationSaga from '@/sagas/location';
import * as Database from '@/services/database';

export const middleware = createSagaMiddleware();

export const run = () => middleware.run(function *() {
  const database = yield call(Database.connect);
  yield call(locationSaga, database);
});
