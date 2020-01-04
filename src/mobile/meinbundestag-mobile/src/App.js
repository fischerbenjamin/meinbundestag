import React from 'react';
import { registerRootComponent } from 'expo';
import { Provider } from 'react-redux';

import storage from './storage/Store';
import AppNavigator from './navigation/AppNavigator';
import WelcomeScreen from './screens/Welcome/WelcomeScreen';
import utils from './resources/Utils';

const STATUS = {
  loading: 'loading',
  error: 'error',
  success: 'success',
};
const TIMEOUT = 30000;

class App extends React.Component {
  constructor(props) {
    storage.subscribeToConsole();
    super(props);
    this.state = {
      status: STATUS.loading,
    };
  }

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
