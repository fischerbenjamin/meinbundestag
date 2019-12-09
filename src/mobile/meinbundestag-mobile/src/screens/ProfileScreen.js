import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import styles from '../style/Views';
import { NavIconProfile } from '../style/Icons';
import ScreenName from '../components/ScreenName';


export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    tabBarIcon: NavIconProfile,
  };

  render() {
    // const { profile } = this.props;
    return (
      <View style={styles.container.basic}>
        <ScreenName name="Profile" />
      </View>
    );
  }
}


ProfileScreen.propTypes = {
  profile: PropTypes.shape.isRequired,
};
