/**
 * @file Implements a BottomTabNavigator for the applicaton
 * @author Benjamin Fischer
 *
 * Connects the four screens to the corresponding data in the redux store so
 * that each screen automatically re-renders when the data changes.
 */

import { connect } from 'react-redux';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import HomeScreen from '../screens/Home/HomeScreen';
import SpeechScreen from '../screens/Speech/SpeechScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import PersonalScreen from '../screens/Personal/PersonalScreen';

import { colorMain } from '../style/Colors';


// HomeScreen
const HomeScreenConnected = connect((state) => (
  { profile: state.profile }
))(HomeScreen);

// ProfileScreen
const ProfileScreenConnected = connect((state) => (
  { profile: state.profile }
))(ProfileScreen);

// PersonalScreen
const PersonalScreenConnected = connect((state) => ({
  profile: state.profile,
  personalContent: state.personalContent,
}))(PersonalScreen);

// SpeechScreen
const SpeechScreenConnected = connect((state) => (
  { profile: state.speech }
))(SpeechScreen);

// Create the BottomTabNavigator
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
