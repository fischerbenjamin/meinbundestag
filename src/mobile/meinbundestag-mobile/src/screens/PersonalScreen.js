import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Clipboard,
  StyleSheet,
} from 'react-native';
import {
  NavIconPersonal,
  OverviewItemSidejobs,
  OverviewItemSpeeches,
  OverviewItemVotes,
  OverviewItemQuestions,
} from '../style/Icons';
import storage from '../storage/Store';
import BaseScreen from './BaseScreen';
import PersonalCollapsable from '../components/PersonalCollapsable';
import {
  renderSpeech, renderQuestion, renderSidejob, renderVote,
} from '../components/PersonalEntries';
import { colorMain, colorWhite } from '../style/Colors';


const SIDEJOBS = 'sidejobs';
const SPEECHES = 'speeches';
const QUESTIONS = 'questions';
const VOTES = 'votes';


const style = StyleSheet.create({

  overviewContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-around',
  },

  overviewItemContainer: {
    flex: 1,
    backgroundColor: colorMain,
    borderRadius: 30,
    margin: 25,
  },

  overviewItemText: {
    fontWeight: 'bold',
    fontSize: 22,
    color: colorWhite,
  },

  overviewItemTextContainer: {
    flex: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  overviewSeparatorContainer: {
    flex: 1,
  },

  overviewIconContainer: {
    flex: 2,
    alignSelf: 'center',
    justifyContent: 'center',
  },

  overviewTouchableContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },

  backToOverviewButton: {
    alignSelf: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: colorMain,
    borderRadius: 20,
    margin: 10,
    marginTop: 20,
    width: '50%',
  },

  backToOverviewText: {
    color: colorWhite,
    fontWeight: '700',
  },

  backToOverviewSep: {
    borderRadius: 10,
    borderBottomColor: colorMain,
    borderBottomWidth: 3,
    width: '90%',
    marginLeft: '5%',
    marginRight: '5%',
    margin: 10,
  },

});


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
      <View style={style.overviewContainer}>
        {this.renderOverviewItem(SPEECHES, 'Reden', OverviewItemSpeeches)}
        {this.renderOverviewItem(QUESTIONS, 'Fragen', OverviewItemQuestions)}
        {this.renderOverviewItem(VOTES, 'Abstimmungen', OverviewItemVotes)}
        {this.renderOverviewItem(SIDEJOBS, 'Nebentätigkeiten', OverviewItemSidejobs)}
      </View>
    );
  }

  renderOverviewItem(content, text, icon) {
    return (
      <View style={style.overviewItemContainer}>
        <TouchableOpacity
          style={style.overviewTouchableContainer}
          onPress={() => this.setState({
            showContent: content,
          })}
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

  renderContent(data, renderListItem, onPressItem) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => this.setState({ showContent: false })}
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
