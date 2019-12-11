import React from 'react';
import { registerRootComponent } from 'expo';
import { Provider } from 'react-redux';

import storage from './storage/Store';
import AppNavigator from './navigation/AppNavigator';


function App() {
  storage.appStore.subscribe(() => console.log(storage.appStore.getState()));
  return (
    <Provider store={storage.appStore}>
      <AppNavigator />
    </Provider>
  );
}


export default registerRootComponent(App);
