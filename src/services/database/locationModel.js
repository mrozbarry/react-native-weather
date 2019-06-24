const SCHEMA_NAME = 'Location';

export default class Location {
  static schema = {
    name: SCHEMA_NAME,
    primaryKey: 'woeid',
    properties: {
      title: 'string',
      location_type: 'string',
      woeid: 'int',
      latt_long: 'string',
    },
  };

  static create = (database, {
    title,
    location_type,
    woeid,
    latt_long,
  }) => {
    try {
      return database.create(SCHEMA_NAME, {
        title,
        location_type,
        woeid,
        latt_long,
      }, 'all');
    } catch (err) {
      console.log('Unable to create database object');
      return null;
    }
  };
}
