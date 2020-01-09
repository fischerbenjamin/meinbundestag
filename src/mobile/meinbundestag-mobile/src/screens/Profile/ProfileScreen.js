import {
  View,
} from 'react-native';
import React from 'react';

import storage from '../../storage/Store';
import BaseScreen from '../Base/BaseScreen';
import Profile from '../../components/Profile/Profile';

import style from './ProfileScreenStyle';
import { NavIconProfile } from '../../style/Icons';


/**
 * @author Benjamin Fischer
 * @description Implementation of the ProfileScreen component
 */

/**
 * @classdesc
 * This class represents the profile screen that displays personal
 * information about the selected deputy.
 * @extends React.Component
 */
class ProfileScreen extends React.Component {
  /**
   * @method
   * @summary Process the name of the profile and return its string representation
   * @param {object} personal - Personal information of the profile
   * @return {string} String representation of the full name
   */
  static processName(personal) {
    const name = `${personal.first_name}  ${personal.last_name}`;
    return name;
  }

  /**
   * @method
   * @summary Process the gender of the profile and return its string representation
   * @param {object} personal - Personal information of the profile
   * @return {string} String representation of the gender in German
   */
  static processGender(personal) {
    const { gender } = personal;
    switch (gender) {
      case 'female':
        return 'weiblich';
      case 'male':
        return 'männlich';
      default:
        return 'n.a';
    }
  }

  /**
   * @method
   * @summary Process the speeches of the profile and return the total number
   * @param {array} speeches - Speeches array
   * @return {number} Total number of speeches
   */
  static processSpeeches(speeches) {
    return speeches.length;
  }

  /**
   * @method
   * @summary Process the committees of the profile and return the total number
   * @param {array} committees - Committees array
   * @return {number} Total number of committees participations
   */
  static processCommittees(committees) {
    return committees.length;
  }

  /**
   * @method
   * @summary Process the questions of the profile and return the string to be displayed
   * @param {array} questions - Array containing the questions
   * @return {string} How many questions have been answered
   */
  static processQuestions(questions) {
    const questionsAnswered = questions.map((question) => {
      const { answers } = question;
      return answers.length !== 0;
    }).filter((answered) => answered);
    const answered = questionsAnswered.length;
    const all = questions.length;
    return `${answered} von ${all} Fragen beantwortet`;
  }

  /**
   * @method
   * @summary Process the whole profile
   * @param {object} profile - Profile object
   * @return {object} String representations for all required keys
   */
  static processProfile(profile) {
    const { personal } = profile;
    const { speeches, questions, committees } = profile;
    return {
      party: profile.party || undefined,
      birthYear: personal.birthyear || undefined,
      education: personal.education || undefined,
      imageUrl: personal.picture.url || undefined,
      state: personal.location.state || undefined,
      profession: personal.profession || undefined,
      name: ProfileScreen.processName(personal) || undefined,
      gender: ProfileScreen.processGender(personal) || undefined,
      speeches: ProfileScreen.processSpeeches(speeches) || undefined,
      questions: ProfileScreen.processQuestions(questions) || undefined,
      committees: ProfileScreen.processCommittees(committees) || undefined,
    };
  }

  // Use the profile icon for this screen
  static navigationOptions = {
    tabBarIcon: NavIconProfile,
  };

  /**
   * @method
   * @summary Render the component
   * @returns {Object} JSX rendered component
   */
  render() {
    const { profile } = storage.getProfile();
    if (profile === undefined) {
      return (
        <BaseScreen
          text="Bitte wählen Sie zuerst ein Profil aus."
        />
      );
    }
    const data = ProfileScreen.processProfile(profile);
    return (
      <View style={style.container}>
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

export default ProfileScreen;
