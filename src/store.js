import { createStore, compose, applyMiddleware } from 'redux';
import rootReducer from '@/reducers';
import * as Saga from '@/sagas';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(rootReducer, composeEnhancers(applyMiddleware(Saga.middleware)));

Saga.run();
