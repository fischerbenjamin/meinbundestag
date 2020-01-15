import React from 'react';
import { Provider } from 'react-redux';
import { registerRootComponent } from 'expo';

import utils from './resources/Utils';
import storage from './storage/Store';
import AppNavigator from './navigation/AppNavigator';
import WelcomeScreen from './screens/Welcome/WelcomeScreen';


/**
 * @file Entry point of the application
 * @author Benjamin Fischer
 * @module App
 */


/**
 * Types of status the app startup can be in
 * @type {Object.<string, string>}
 */
const STATUS = {
  loading: 'loading',
  error: 'error',
  success: 'success',
};

/**
 * Predefined timeout after the startup fails
 * @type {number}
 */
const TIMEOUT = 30000;

/**
 * @classdesc
 * This class represents the Application. It renders the welcome screen until
 * the data is either fetched successfully or the timeout is passed. On success,
 * the actual application is started by switching to the home screen.
 */
class App extends React.Component {
  constructor(props) {
    storage.subscribeToConsole();
    super(props);
    this.state = {
      status: STATUS.loading,
    };
  }

  /**
   * @method
   * @async
   * @summary Load external data when the application is launched
   * @description
   * The list of deputies is fetched when the application is launched. This
   * is required because the suggestions in the home screen are based on this
   * data. If the data is not fetched after the default timeout, the status
   * switches to 'error' and the application will show an error message.
   */
  async componentDidMount() {
    setTimeout(() => {
      const { status } = this.state;
      if (status === STATUS.loading) {
        this.setState({ status: STATUS.error });
      }
    }, TIMEOUT);
    await utils.getDeputies();
    const { status } = this.state;
    if (status === STATUS.loading) {
      this.setState({ status: STATUS.success });
    }
  }

  /**
   * @method
   * @summary Render the component
   * @description
   * Render the application. Show the welcome screen until the data is fetched.
   * Afterwards, show the home screen.
   * @returns {Object} JSX rendered component
   */
  render() {
    const { status } = this.state;
    switch (status) {
      case STATUS.error:
        return (<WelcomeScreen isLoading={false} />);
      case STATUS.loading:
        return (<WelcomeScreen isLoading />);
      case STATUS.success:
        return (
          <Provider store={storage.getStore()}>
            <AppNavigator />
          </Provider>
        );
      default:
        return null;
    }
  }
}

export default registerRootComponent(App);
