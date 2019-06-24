import * as Actions from '@/actions';

const INITIAL_STATE = {};

export default (reports = INITIAL_STATE, action) => {
  switch (action.type) {
    case Actions.LOCATIONS_INDEX:
      return action.locations.reduce((memo, { woeid }) => ({
        ...memo,
        [woeid]: reports[woeid] || {},
      }), {});

    case Actions.REPORTS_ADD:
      return {
        ...reports,
        [action.report.woeid]: action.report,
      };

    default:
      return reports;
  }
};
