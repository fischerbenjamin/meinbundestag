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
import { colorMain } from '../style/Colors';


const style = StyleSheet.create({

  separator: {
    borderRadius: 10,
    borderBottomColor: colorMain,
    borderBottomWidth: 3,
    width: '90%',
    marginLeft: '5%',
    marginRight: '5%',
    margin: 10,
    marginBottom: 20,
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
    const renderedParagraphs = entries.map((entry, index) => {
      const isSpeaker = entry.is_speaker;
      const { paragraphs, speaker } = entry;
      const key = `${speaker} ${index}`;
      return (
        <Paragraph
          key={key}
          isSpeaker={isSpeaker}
          paragraphs={paragraphs}
          speaker={speaker}
        />
      );
    });
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
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
