const SCHEMA_NAME = 'Weather';

export default class Weather {
  static schema = {
    name: SCHEMA_NAME,
    primaryKey: 'id',
    properties: {
      id: 'int',
      weather_state_name: 'string',
      applicable_date: 'date',
      min_temp: 'float',
      max_temp: 'float',
      the_temp: 'float',
      humidity: 'float',
    },
  };

  static create = (database, {
    id,
    weather_state_name,
    applicable_date,
    min_temp,
    max_temp,
    the_temp,
    humidity,
  }) => {
    try {
      return database.create(SCHEMA_NAME, {
        id,
        weather_state_name,
        applicable_date: new Date(`${applicable_date}T00:00:00.000Z`),
        min_temp,
        max_temp,
        the_temp,
        humidity,
      }, 'all');
    } catch (err) {
      console.log('Unable to create database object');
      return null;
    }
  };
}
