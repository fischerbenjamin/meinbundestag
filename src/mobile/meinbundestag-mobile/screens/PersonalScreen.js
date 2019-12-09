import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import styles from '../style/Views';
import { NavIconPersonal } from '../style/Icons';
import ScreenName from '../components/ScreenName';


export default class PersonalScreen extends React.Component {
  static navigationOptions = {
    tabBarIcon: NavIconPersonal,
  };

  render() {
    // const { profile } = this.props;
    return (
      <View style={styles.container.basic}>
        <ScreenName name="Personal" />
      </View>
    );
  }
}


PersonalScreen.propTypes = {
  profile: PropTypes.shape.isRequired,
};
