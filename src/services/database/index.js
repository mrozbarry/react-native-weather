import Realm from 'realm';
import LocationModel from '@/services/database/locationModel';
import ReportModel from '@/services/database/reportModel';
import WeatherModel from '@/services/database/weatherModel';

let database = null;

export const LOCATIONS = LocationModel.schema.name;

export const connect = async (options = {}) => {
  if (database) {
    return database;
  }

  console.log('Opening realm database');

  try {
    database = await Realm.open({
      ...options,
      schema: [
        LocationModel,
        ReportModel,
        WeatherModel,
      ],
      schemaVersion: 3,
    });
  } catch (err) {
    console.log('Unable to open realm, attempting cycle', err);
    console.log({ ...err });
    // return connect(options);
    throw err;
  }

  console.log('Realm ready');

  return database;
};

export const disconnect = () => {
  if (database) {
    database.close()
    database = null;
  }
};

export const write = cb => database.write(cb);
