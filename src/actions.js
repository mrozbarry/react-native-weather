export const LOCATIONS_FETCH = 'LOCATIONS_SEARCH';

export const LOCATIONS_INDEX = 'LOCATIONS_INDEX';
export const LOCATIONS_CREATE = 'LOCATIONS_CREATE';

export const REPORTS_ADD = 'REPORTS_ADD';

export const locationsFetch = query => ({
  type: LOCATIONS_FETCH,
  query,
});

export const locationsIndex = (locations, query) => ({
  type: LOCATIONS_INDEX,
  locations,
  query,
});

export const reportsAdd = report => ({
  type: REPORTS_ADD,
  report,
});
