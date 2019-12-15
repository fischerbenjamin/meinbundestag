import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Clipboard,
} from 'react-native';

import { NavIconPersonal } from '../style/Icons';
import storage from '../storage/Store';
import BaseScreen from './BaseScreen';
import PersonalCollapsable from '../components/PersonalCollapsable';
import {
  renderSpeech, renderQuestion, renderSidejob, renderVote,
} from '../components/PersonalEntries';
import { colorMain } from '../style/Colors';


const SIDEJOBS = 'sidejobs';
const SPEECHES = 'speeches';
const QUESTIONS = 'questions';
const VOTES = 'votes';

export default class PersonalScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showContent: false,
    };
  }

  static navigationOptions = {
    tabBarIcon: NavIconPersonal,
  };

  showOverview() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'space-around',
        }}
      >
        {this.renderOverviewItem(SIDEJOBS, 'Nebentätigkeiten')}
        {this.renderOverviewItem(SPEECHES, 'Reden')}
        {this.renderOverviewItem(QUESTIONS, 'Fragen')}
        {this.renderOverviewItem(VOTES, 'Abstimmungen')}
      </View>
    );
  }

  renderOverviewItem(content, text) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colorMain,
          borderRadius: 30,
          margin: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => this.setState({
            showContent: content,
          })}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontWeight: 900,
              fontSize: 22,
              color: '#fff',
            }}
          >
            {text}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderContent(data, renderListItem, onPressItem) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => this.setState({ showContent: false })}
        >
          <View
            style={{
              alignSelf: 'center',
              alignItems: 'center',
              padding: 10,
              backgroundColor: colorMain,
              borderRadius: 20,
              margin: 10,
              width: '50%',
            }}
          >
            <Text>Zurück zur Übersicht</Text>
          </View>
        </TouchableOpacity>
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
      return BaseScreen.renderDefault(
        'Bitte wählen Sie zuerst ein Profil aus.',
      );
    }
    const {
      sidejobs, votes, questions, speeches,
    } = profile;
    const { showContent } = this.state;
    const { navigate } = this.props.navigation;
    switch (showContent) {
      case SIDEJOBS:
        return this.renderContent(
          sidejobs, renderSidejob,
          ((item) => Clipboard.setString(item.organization)),
        );
      case SPEECHES:
        return this.renderContent(
          speeches, renderSpeech,
          ((item) => {
            storage.setSpeech(item);
            navigate('speech');
          }),
        );
      case VOTES:
        return this.renderContent(
          votes, renderVote,
          (item) => Clipboard.setString(item.url),
        );
      case QUESTIONS:
        return this.renderContent(
          questions, renderQuestion,
          ((item) => Clipboard.setString(item.url)),
        );
      default:
        return this.showOverview();
    }
  }
}
