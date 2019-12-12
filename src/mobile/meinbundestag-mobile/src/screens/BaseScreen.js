import {
  View,
  Text,
} from 'react-native';
import React from 'react';

import styles from '../style/Views';

export default class BaseScreen {
  static renderDefault(text) {
    return (
      <View style={styles.container.basic.centerAll}>
        <Text>
          {text}
        </Text>
      </View>
    );
  }
}
