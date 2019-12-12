import {
  View,
  Text,
} from 'react-native';
import React from 'react';

import styles from '../style/Views';
import { NavIconSpeech } from '../style/Icons';
import storage from '../storage/Store';
import BaseScreen from './BaseScreen';

export default class SpeechScreen extends React.Component {
  static navigationOptions = {
    tabBarIcon: NavIconSpeech,
  };

  render() {
    const { speech } = storage.getProfile();
    if (speech === undefined) {
      return BaseScreen.renderDefault(
        'Bitte wählen Sie zuerst eine Rede aus.',
      );
    }
    return (
      <View style={styles.container.basic.centerAll}>
        <Text>
          Rede wurde ausgewählt.
        </Text>
      </View>
    );
  }
}
