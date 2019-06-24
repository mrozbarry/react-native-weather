import { combineReducers } from 'redux';

import locations from '@/reducers/locations';
import reports from '@/reducers/reports';

export default combineReducers({
  locations,
  reports,
});
