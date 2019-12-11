import {
  View,
  Text,
} from 'react-native';
import React from 'react';

import styles from '../style/Views';
import { NavIconProfile } from '../style/Icons';
import storage from '../storage/Store';

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    tabBarIcon: NavIconProfile,
  };

  render() {
    const { personal } = storage.appStore.getState().profile.profile;
    return (
      <View style={styles.container.basic.centerAll}>
        <Text>
          {personal.first_name}
          {personal.last_name}
          {personal.birthyear}
        </Text>
      </View>
    );
  }
}
