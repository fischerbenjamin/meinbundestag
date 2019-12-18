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
    const { speeches, questions, committees} = profile;
    const numberSpeeches = speeches.length;
    const numberCommittees = committees.length;
    const questionsAnswered = questions.map((question) => {
      const { answers } = question;
      return answers.length !== 0;
    }).filter((answered) => answered);
    const displayQuestions = (() => {
      const answered = questionsAnswered.length;
      const all = questions.length;
      return `${answered} von ${all} Fragen beantwortet`;
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
      questions: displayQuestions || undefined,
      speeches: numberSpeeches || undefined,
      committees: numberCommittees || undefined,
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
          questions={data.questions}
          speeches={data.speeches}
          committees={data.committees}
        />
      </View>
    );
  }
}
