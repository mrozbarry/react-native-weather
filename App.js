import React from 'react';
import { Provider } from 'react-redux';

import Weather from '@/Weather';
import store from '@/store';

export default App = () => (
  <Provider store={store}>
    <Weather />
  </Provider>
);
