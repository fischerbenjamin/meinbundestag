import {
  View,
  ScrollView,
} from 'react-native';
import React from 'react';

import storage from '../../storage/Store';
import BaseScreen from '../Base/BaseScreen';
import Paragraph from '../../components/Speech/Paragraph';
import SpeechHeader from '../../components/Speech/SpeechHeader';

import style from './SpeechScreenStyle';
import { NavIconSpeech } from '../../style/Icons';


/**
 * @author Benjamin Fischer
 * @description Implementation of the SpeechScreen component
 */

/**
 * @classdesc
 * This class represents the screen that is responsible for displaying
 * the selected speech.
 * @extends React.Component
 */
class SpeechScreen extends React.Component {
  // Use the speech icon for this screen
  static navigationOptions = {
    tabBarIcon: NavIconSpeech,
  };

  /**
   * @method
   * @summary Render the entries of the speech to JSX components.
   * @param {array} entries - entries of the speech
   * @return {Object} JSX rendered component
   */
  static renderParagraphs(entries) {
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
    return renderedParagraphs;
  }

  /**
   * @method
   * @summary Render the component
   * @return {Object} JSX rendered component
   */
  render() {
    const speech = storage.getSpeech();
    if (Object.entries(speech).length === 0) {
      return (
        <BaseScreen
          text="Bitte wählen Sie zuerst eine Rede aus."
        />
      );
    }
    const { content, meta, analysis } = speech;
    const { entries } = content;
    const {
      date, name, topic, party,
    } = meta;
    const { polarity, subjectivity } = analysis;
    const renderedParagraphs = SpeechScreen.renderParagraphs(entries);
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

export default SpeechScreen;
