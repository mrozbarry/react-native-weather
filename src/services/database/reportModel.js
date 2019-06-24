import WeatherModel from '@/services/database/weatherModel';

const SCHEMA_NAME = 'Report';

export default class Report {
  static schema = {
    name: SCHEMA_NAME,
    primaryKey: 'woeid',
    properties: {
      woeid: 'int',
      sun_rise: 'date',
      sun_set: 'date',
      time: 'date',
      weather: {
        type: 'list',
        objectType: WeatherModel.schema.name,
      },
    },
  };

  static create = (database, {
    woeid,
    sun_rise,
    sun_set,
    time,
    consolidated_weather,
  }) => {
    try {
      const report = database.create(SCHEMA_NAME, {
        woeid,
        sun_rise: new Date(sun_rise),
        sun_set: new Date(sun_set),
        time: new Date(time),
      }, 'all');

      consolidated_weather.forEach((weather) => {
        try {
          const item = WeatherModel.create(database, weather)
          report.weather.push(item);
        } catch (err) {
          console.log('Unable to create WeatherModel', weather, err);
        }
      });

      return report;
    } catch (err) {
      console.log('Unable to create database object');
      console.log(err);
      return null;
    }
  };
}
