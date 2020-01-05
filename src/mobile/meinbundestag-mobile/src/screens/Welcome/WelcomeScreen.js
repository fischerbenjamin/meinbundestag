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
 * WelcomeScreen
 *  This class represents the Welcome screen that is shown on the startup while
 *  external data is loaded.
 * @extends React.PureComponent
 */
export default class WelcomeScreen extends React.PureComponent {
  /**
   * Render component when the application is still loading external data.
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
   * Render component when loading external data failed.
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
   * Render the component.
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
