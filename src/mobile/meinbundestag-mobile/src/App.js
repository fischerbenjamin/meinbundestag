import React from 'react';
import { registerRootComponent } from 'expo';
import { Provider } from 'react-redux';

import storage from './storage/Store';
import AppNavigator from './navigation/AppNavigator';


function App() {
  storage.appStore.subscribe(() => console.log(storage.appStore.getState()));
  storage.setProfile('Hans');
  storage.setProfile({ meta: 'meta', speeches: [1, 2, 3] });
  return (
    <Provider store={storage.appStore}>
      <AppNavigator />
    </Provider>
  );
}


export default registerRootComponent(App);
