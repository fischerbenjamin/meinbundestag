import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';

import style from './WelcomeScreenStyle';
import { NoConnection } from '../../style/Icons';

/**
 * @author Benjamin Fischer
 * @description Implementation of the WelcomeScreen component
 */


/**
 * @classdesc
 * This class represents the Welcome screen that is shown on the startup while
 * external data is loaded.
 * @extends React.PureComponent
 */
class WelcomeScreen extends React.PureComponent {
  /**
   * @method
   * @summary Render component when the application is still loading external data.
   * @returns {Object} JSX rendered component
   */
  static renderLoading() {
    return (
      <View style={style.screen}>
        <View style={style.container}>
          <Text style={style.textHeading}>
            MeinBundestag
          </Text>
        </View>
        <View style={style.container}>
          <Text style={style.text}>
            Daten werden vom Server geladen
          </Text>
        </View>
        <View style={style.container}>
          <ActivityIndicator
            color="white"
            size="large"
          />
        </View>
      </View>
    );
  }

  /**
   * @method
   * @summary Render component when loading external data failed
   * @return {Object} JSX component for failure
   */
  static renderFailure() {
    return (
      <View style={style.screen}>
        <View style={style.container}>
          {NoConnection}
          <Text style={[style.text, style.textError]}>
            Leider konnte keine Verbindung zum Server hergestellt werden.
          </Text>
          <Text style={[style.text, style.textError]}>
            Bitte stellen Sie sicher, dass eine Internetverbindung besteht
            und starten Sie die Anwendung neu.
          </Text>
        </View>
      </View>
    );
  }

  /**
   * @method
   * @summary Render the component
   * @return {Object} JSX rendered component
   */
  render() {
    const { isLoading } = this.props;
    if (isLoading) {
      return WelcomeScreen.renderLoading();
    }
    return WelcomeScreen.renderFailure();
  }
}

WelcomeScreen.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};

export default WelcomeScreen;
