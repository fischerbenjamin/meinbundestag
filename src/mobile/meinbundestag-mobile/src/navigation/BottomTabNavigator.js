import { connect } from 'react-redux';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import HomeScreen from '../screens/HomeScreen';
import SpeechScreen from '../screens/SpeechScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PersonalScreen from '../screens/PersonalScreen';

import { colorMain } from '../style/Colors';


const HomeScreenConnected = connect((state) => (
  { profile: state.profile }
))(HomeScreen);

const ProfileScreenConnected = connect((state) => (
  { profile: state.profile }
))(ProfileScreen);

const PersonalScreenConnected = connect((state) => ({
  profile: state.profile,
  personalContent: state.personalContent,
}))(PersonalScreen);

const SpeechScreenConnected = connect((state) => (
  { profile: state.speech }
))(SpeechScreen);

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
