import React from 'react';
import { registerRootComponent } from 'expo';
import { Provider } from 'react-redux';

import storage from './storage/Store';
import AppNavigator from './navigation/AppNavigator';


function App() {
  storage.subscribeToConsole();
  return (
    <Provider store={storage.getStore()}>
      <AppNavigator />
    </Provider>
  );
}


export default registerRootComponent(App);
