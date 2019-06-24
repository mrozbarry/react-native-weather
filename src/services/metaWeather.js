import http from '@/services/fetch';

const metaweatherApi = (trailing, options) =>
  http(`https://www.metaweather.com/api/${trailing}`, options);

export const search = query =>
  metaweatherApi(`/location/search/?query=${query}`);

export const weather = woeid =>
  metaweatherApi(`/location/${woeid}`);
