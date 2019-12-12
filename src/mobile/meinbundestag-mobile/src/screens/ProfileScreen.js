import {
  View,
} from 'react-native';
import React from 'react';

import styles from '../style/Views';
import { NavIconProfile } from '../style/Icons';
import storage from '../storage/Store';
import BaseScreen from './BaseScreen';
import Profile from '../components/Profile';

export default class ProfileScreen extends React.Component {
  static processProfileData(profile) {
    const { personal } = profile;
    const name = `${personal.first_name}  ${personal.last_name}`;
    const sex = (() => {
      const { gender } = personal;
      if (gender === 'female') return 'weiblich';
      if (gender === 'male') return 'männlich';
      return 'n.a';
    })();
    return {
      imageUrl: personal.picture.url || undefined,
      name: name || undefined,
      party: profile.party || undefined,
      state: personal.location.state || undefined,
      gender: sex || undefined,
      birthYear: personal.birthyear || undefined,
      education: personal.education || undefined,
      profession: personal.profession || undefined,
    };
  }

  static navigationOptions = {
    tabBarIcon: NavIconProfile,
  };

  render() {
    const { profile } = storage.getProfile();
    if (profile === undefined) {
      return BaseScreen.renderDefault(
        'Bitte wählen Sie zuerst ein Profil aus.',
      );
    }
    const data = ProfileScreen.processProfileData(profile);
    return (
      <View style={styles.container.basic.centerAll}>
        <Profile
          imageUrl={data.imageUrl}
          name={data.name}
          party={data.party}
          state={data.state}
          gender={data.gender}
          birthYear={data.birthYear}
          education={data.education}
          profession={data.profession}
        />
      </View>
    );
  }
}
