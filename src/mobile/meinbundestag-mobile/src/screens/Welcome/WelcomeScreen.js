import {
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
import style from './WelcomeScreenStyle';
import { NoConnection } from '../../style/Icons';


export default class WelcomeScreen extends React.PureComponent {
  render() {
    const { isLoading } = this.props;
    if (!isLoading) {
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
}

WelcomeScreen.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};
