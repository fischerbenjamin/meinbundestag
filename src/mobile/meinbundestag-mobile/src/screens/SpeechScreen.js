import {
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React from 'react';

import { NavIconSpeech } from '../style/Icons';
import storage from '../storage/Store';
import BaseScreen from './BaseScreen';
import Paragraph from '../components/Paragraph';
import SpeechHeader from '../components/SpeechHeader';


const style = StyleSheet.create({

  separator: {
    borderBottomColor: '#4D5E72',
    borderBottomWidth: 2,
    width: '90%',
    marginLeft: '5%',
    marginRight: '5%',
    margin: 10,
  },

});

export default class SpeechScreen extends React.Component {
  static navigationOptions = {
    tabBarIcon: NavIconSpeech,
  };

  render() {
    const speech = storage.getSpeech();
    if (Object.entries(speech).length === 0) {
      return BaseScreen.renderDefault(
        'Bitte wählen Sie zuerst eine Rede aus.',
      );
    }
    const { content, meta, analysis } = speech;
    const { entries } = content;
    const {
      date, name, topic, party,
    } = meta;
    const { polarity, subjectivity } = analysis;
    const renderedParagraphs = entries.map((entry) => {
      const isSpeaker = entry.is_speaker;
      const { paragraphs, speaker } = entry;
      return (
        <Paragraph
          isSpeaker={isSpeaker}
          paragraphs={paragraphs}
          speaker={speaker}
        />
      );
    });
    return (
      <ScrollView>
        <SpeechHeader
          date={date}
          name={name}
          topic={topic}
          party={party}
          polarity={polarity}
          subjectivity={subjectivity}
        />
        <View style={style.separator} />
        <View>
          {renderedParagraphs}
        </View>
      </ScrollView>
    );
  }
}
