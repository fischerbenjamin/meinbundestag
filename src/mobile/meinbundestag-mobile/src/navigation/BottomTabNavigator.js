import { connect } from 'react-redux';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import {
  HomeScreen,
  SpeechScreen,
  ProfileScreen,
  PersonalScreen,
} from '../screens/Screens';

import { colorMain } from '../style/Colors';

/**
 * @author Benjamin Fischer
 * @description
 * Implements a BottomTabNavigator for the applicaton. It connects the
 * different type of screens to the corresponding data in the redux store so
 * that each screen automatically re-renders when the data changes.
 * @module BottomTabNavigator
 */


/**
 * @summary HomeScreen connected to the app store
 */
const HomeScreenConnected = connect((state) => (
  { profile: state.profile }
))(HomeScreen);

/**
 * @summary ProfileScreen connected to the app store
 */
const ProfileScreenConnected = connect((state) => (
  { profile: state.profile }
))(ProfileScreen);

/**
 * @summary PersonalScreen connected to the app store
 */
const PersonalScreenConnected = connect((state) => ({
  profile: state.profile,
  personalContent: state.personalContent,
}))(PersonalScreen);

/**
 * @summary SpeechScreen connected to the app store
 */
const SpeechScreenConnected = connect((state) => (
  { profile: state.speech }
))(SpeechScreen);

/**
 * @summary BottomTabNavigator
 */
const BottomTabNavigator = createBottomTabNavigator(
  {
    home: HomeScreenConnected,
    profile: ProfileScreenConnected,
    personal: PersonalScreenConnected,
    speech: SpeechScreenConnected,
  },
  {
    tabBarOptions: {
      showLabel: false,
      style: {
        borderTopWidth: 3,
        borderTopColor: colorMain,
      },
    },
  },
);

export default BottomTabNavigator;
