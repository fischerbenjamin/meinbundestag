import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Clipboard,
} from 'react-native';

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
} from '../../components/PersonalEntries/PersonalEntries';
import style from './PersonalScreenStyle';

const SIDEJOBS = 'sidejobs';
const SPEECHES = 'speeches';
const QUESTIONS = 'questions';
const VOTES = 'votes';
const OVERVIEW = '';


export default class PersonalScreen extends React.Component {
  static showOverview() {
    return (
      <View style={style.overviewContainer}>
        {this.renderOverviewItem(SPEECHES, 'Reden', OverviewItemSpeeches)}
        {this.renderOverviewItem(QUESTIONS, 'Fragen', OverviewItemQuestions)}
        {this.renderOverviewItem(VOTES, 'Abstimmungen', OverviewItemVotes)}
        {this.renderOverviewItem(SIDEJOBS, 'Nebentätigkeiten', OverviewItemSidejobs)}
      </View>
    );
  }

  static navigationOptions = {
    tabBarIcon: NavIconPersonal,
  };

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

  static renderContent(data, renderListItem, onPressItem) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
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
      </ScrollView>
    );
  }

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
    const { navigate } = this.props.navigation;
    switch (personalContent) {
      case SIDEJOBS:
        return PersonalScreen.renderContent(
          sidejobs, renderSidejob,
          ((item) => Clipboard.setString(item.organization)),
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
          (item) => Clipboard.setString(item.url),
        );
      case QUESTIONS:
        return PersonalScreen.renderContent(
          questions, renderQuestion,
          ((item) => Clipboard.setString(item.url)),
        );
      default:
        return PersonalScreen.showOverview();
    }
  }
}

