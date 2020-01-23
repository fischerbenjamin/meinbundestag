import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import PropTypes from 'prop-types';

import {
  NavIconPersonal,
  OverviewItemSidejobs,
  OverviewItemSpeeches,
  OverviewItemVotes,
  OverviewItemQuestions,
} from '../../style/Icons';
import storage from '../../storage/Store';
import BaseScreen from '../Base/BaseScreen';
import PersonalCollapsable from '../../components/PersonalCollapsable/PersonalCollapsable';
import {
  renderSpeech, renderQuestion, renderSidejob, renderVote,
} from '../../components/PersonalCollapsable/PersonalEntries';
import utils from '../../resources/Utils';
import style from './PersonalScreenStyle';

const SIDEJOBS = 'sidejobs';
const SPEECHES = 'speeches';
const QUESTIONS = 'questions';
const VOTES = 'votes';
const OVERVIEW = '';


/**
 * @author Benjamin Fischer
 * @description Implementation of the PersonalScreen component
 */

/**
 * @classdesc
 * This screen displays personal information about the deputy. The user
 * can list the speeches, questions, votes and sidejobs of the selected deputy.
 * @extends React.Component
 */
class PersonalScreen extends React.Component {
  /**
   * @method
   * @summary Render the overview view of the screen
   * @description
   * Creates four buttons for each category the user can click. The component
   * re-renders and displays the selected data.
   * @returns {Object} JSX rendered component
   */
  static renderOverview() {
    return (
      <View style={style.overviewContainer}>
        {this.renderOverviewItem(SPEECHES, 'Reden', OverviewItemSpeeches)}
        {this.renderOverviewItem(QUESTIONS, 'Fragen', OverviewItemQuestions)}
        {this.renderOverviewItem(VOTES, 'Abstimmungen', OverviewItemVotes)}
        {this.renderOverviewItem(SIDEJOBS, 'Nebentätigkeiten', OverviewItemSidejobs)}
      </View>
    );
  }

  // Use the personal icon for this screen
  static navigationOptions = {
    tabBarIcon: NavIconPersonal,
  };

  /**
   * @method
   * @summary Render a single overview button
   * @param {string} content - the type of content (speeches, questions, etc.)
   * @param {string} text - the text to display next to the icon
   * @param {Object} icon - the icon to show
   * @returns {Object} JSX rendered component
   */
  static renderOverviewItem(content, text, icon) {
    return (
      <View style={style.overviewItemContainer}>
        <TouchableOpacity
          style={style.overviewTouchableContainer}
          onPress={() => storage.setPersonalContent(content)}
        >
          <View style={{ flexDirection: 'row' }}>
            <View style={style.overviewSeparatorContainer} />
            <View style={style.overviewIconContainer}>
              {icon}
            </View>
            <View style={style.overviewSeparatorContainer} />
            <View style={style.overviewItemTextContainer}>
              <Text style={style.overviewItemText}>
                {text}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  /**
   * @summary Render the selected content
   * @param {array} data - array containing the selected data
   * @param {function} renderListItem - how to render a single entry
   * @param {function} onPressItem - callback when entry is pressed
   * @returns {Object} JSX rendered component
   */
  static renderContent(data, renderListItem, onPressItem) {
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={() => storage.setPersonalContent(OVERVIEW)}
        >
          <View style={style.backToOverviewButton}>
            <Text style={style.backToOverviewText}>
              Zurück zur Übersicht
            </Text>
          </View>
        </TouchableOpacity>
        <View style={style.backToOverviewSep} />
        <PersonalCollapsable
          data={data}
          renderListItem={renderListItem}
          onPressItem={onPressItem}
        />
      </View>
    );
  }

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
          text="Bitte wählen Sie zuerst ein Profil aus"
        />
      );
    }
    const personalContent = storage.getPersonalContent();
    const {
      sidejobs, votes, questions, speeches,
    } = profile;
    const { navigation } = this.props;
    const { navigate } = navigation;
    switch (personalContent) {
      case SIDEJOBS:
        return PersonalScreen.renderContent(
          sidejobs, renderSidejob,
          ((item) => {
            const searchURL = utils.getGoogleSearchUrl(item.organization);
            Linking.openURL(searchURL);
          }),
        );
      case SPEECHES:
        return PersonalScreen.renderContent(
          speeches, renderSpeech,
          ((item) => {
            storage.setSpeech(item);
            navigate('speech');
          }),
        );
      case VOTES:
        return PersonalScreen.renderContent(
          votes, renderVote,
          ((item) => Linking.openURL(item.url)),
        );
      case QUESTIONS:
        return PersonalScreen.renderContent(
          questions, renderQuestion,
          ((item) => Linking.openURL(item.url)),
        );
      default:
        return PersonalScreen.renderOverview();
    }
  }
}


PersonalScreen.propTypes = {
  navigation: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default PersonalScreen;
