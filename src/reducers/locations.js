import * as Actions from '@/actions';

const INITIAL_STATE = {
  data: [],
  query: '',
  loading: false,
};

export default (locations = INITIAL_STATE, action) => {
  switch (action.type) {
    case Actions.LOCATIONS_FETCH:
      return {
        ...locations,
        query: action.query,
        loading: true,
      };

    case Actions.LOCATIONS_INDEX:
      return {
        ...locations,
        data: action.locations,
        loading: false,
      };

    default:
      return locations;
  }
};
