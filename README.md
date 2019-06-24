# React Native Weather App

Offline-first react native weather app. Uses metaweather.com's API

## Installing

```bash
yarn
yarn start
# in another tab/whatever
yarn run ios
# or
yarn run android
```

## Tech

Uses RealmDB and redux-saga to manage offline first behaviour.

## Flow

 1. [USER] Search for a city (note: metaweather's location list is rather limited, aim for capitols/large cities)
 2. [REDUX-SAGA] Kick off fork to search
   - Start a live RealmDB query for our city
     - On changes:
        - Map Realm objects to location POJOs
        - Submit data to redux
   - Make request to API
     - On success:
        - Write to realm database (which will trigger above flow)
 3. [REDUX-SAGA] Manage collection of forks to get weather reports for each location object
   - To maintain the collection of forks
     - If there is already a fork for this location woeid, continue
     - If there isn't a fork for this location woeid, create one
     - If a previous fork is no longer used, cancel it
   - Each fork
     - Start a live RealmDB query on reports for the location woeid
       - Map Realm objects to report POJOs
       - submit data to redux
     - Make request to API
       - On success:
         - Write to realm database (which will trigger above flow)

## Notes

This app is a demo, and not intended to be a released app, but I might release it in the future.
I will be adding an appropriate license later

## License

Licensed under [MIT](./LICENSE.md).
