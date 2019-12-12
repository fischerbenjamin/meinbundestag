import React from 'react';
import {
  View,
  Text,
} from 'react-native';

import styles from '../style/Views';
import { NavIconPersonal } from '../style/Icons';
import storage from '../storage/Store';
import BaseScreen from './BaseScreen';


export default class PersonalScreen extends React.Component {
  static navigationOptions = {
    tabBarIcon: NavIconPersonal,
  };

  render() {
    const { profile } = storage.getProfile();
    if (profile === undefined) {
      return BaseScreen.renderDefault(
        'Bitte wählen Sie zuerst ein Profil aus.',
      );
    }
    return (
      <View style={styles.container.basic.centerAll}>
        <Text>
          Profil wurde ausgewählt.
        </Text>
      </View>
    );
  }
}
