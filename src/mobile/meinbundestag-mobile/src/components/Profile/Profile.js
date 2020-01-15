import React from 'react';
import {
  View,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

import ProfileEntry from './ProfileEntry';

import style from './ProfileStyle';


/**
 * @author Benjamin Fischer
 * @description Implementation of the Profile component
 */


/**
 * @classdesc
 * This class represents a profile of a deputy. The profile is used to display
 * some personal information about the deputy, such as age, location, etc.
 * @extends React.PureComponent
 */
class Profile extends React.PureComponent {
  /**
   * @summary Render the header of the profile
   * @description
   * The header basically consists of the profile picture.
   * @returns {Object} JSX rendered component
   */
  renderHeader() {
    const { imageUrl } = this.props;
    let source = { uri: imageUrl };
    if (imageUrl === undefined) {
      source = require('../../../assets/icon.png'); // eslint-disable-line global-require
    }
    return (
      <View style={style.header}>
        <View style={style.headerImageView}>
          <Image
            style={style.headerImage}
            source={source}
          />
        </View>
      </View>
    );
  }

  /**
   * @summary Render the component
   * @returns {Object} JSX rendered component
   */
  render() {
    const {
      name, party, gender, birthYear, state, education, profession,
      questions, speeches, committees,
    } = this.props;
    const header = this.renderHeader();
    return (
      <View style={style.container}>
        {header}
        <View style={style.headerSeparator} />
        <View style={style.body}>
          <ProfileEntry description="Name" value={name} />
          <ProfileEntry description="Partei" value={party} />
          <ProfileEntry description="Geburtsjahr" value={birthYear} />
          <ProfileEntry description="Geschlecht" value={gender} />
          <ProfileEntry description="Bundesland" value={state} />
          <ProfileEntry description="Abschluss" value={education} />
          <ProfileEntry description="Amt" value={profession} />
          <ProfileEntry description="Fragen" value={questions} />
          <ProfileEntry description="Reden" value={speeches} />
          <ProfileEntry description="Aussschüsse" value={committees} />
        </View>
      </View>
    );
  }
}

/**
 * @description Properties of the component (all optional)
 * @property {string} imageUrl - url of the profile picture
 * @property {string} name - name of the deputy
 * @property {string} party - party of the deputy
 * @property {string} state - state of the deputy
 * @property {string} gender - gender of the deputy
 * @property {string} birthYear - url of the profile picture
 * @property {string} education - education
 * @property {string} profession - profession
 * @property {string} questions - how many questions have been answered
 * @property {number} speeches - number of speeches
 * @property {number} committees - number of committees the deputy is present in
 */
Profile.propTypes = {
  imageUrl: PropTypes.string,
  name: PropTypes.string,
  party: PropTypes.string,
  state: PropTypes.string,
  gender: PropTypes.string,
  birthYear: PropTypes.string,
  education: PropTypes.string,
  profession: PropTypes.string,
  questions: PropTypes.string,
  speeches: PropTypes.number,
  committees: PropTypes.number,
};

/**
 * @description Default properties
 */
Profile.defaultProps = {
  imageUrl: undefined,
  name: 'keine Angabe',
  party: 'keine Angabe',
  state: 'keine Angabe',
  gender: 'keine Angabe',
  birthYear: 'keine Angabe',
  education: 'keine Angabe',
  profession: 'keine Angabe',
  questions: 'keine Angabe',
  speeches: 0,
  committees: 0,
};

export default Profile;
