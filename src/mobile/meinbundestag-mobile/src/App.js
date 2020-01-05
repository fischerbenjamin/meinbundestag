/**
 * @file Entry point of the application
 * @author Benjamin Fischer
 */

import React from 'react';
import { Provider } from 'react-redux';
import { registerRootComponent } from 'expo';

import utils from './resources/Utils';
import storage from './storage/Store';
import AppNavigator from './navigation/AppNavigator';
import WelcomeScreen from './screens/Welcome/WelcomeScreen';


// Types for the status of startup.
const STATUS = {
  loading: 'loading',
  error: 'error',
  success: 'success',
};
// Timeout after the startup fails.
const TIMEOUT = 30000;

/**
 * App
 *  This class implements the application. It displas the WelcomeScreen until
 *  all data is loaded and then switches to the HomeScreen. On failure, an
 *  error message is displayed and the application has to be restarted.
 */
class App extends React.Component {
  /**
   * Initialize the App component
   * @constructor
   * @param {object} props - Properties of the component
   */
  constructor(props) {
    storage.subscribeToConsole();
    super(props);
    this.state = {
      status: STATUS.loading,
    };
  }

  /**
   * Load the external data (list of deputies) on startup before switching
   * to the HomeScreen.
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
   * Render the component.
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
