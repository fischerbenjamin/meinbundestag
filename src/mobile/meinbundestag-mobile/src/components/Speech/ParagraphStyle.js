import { StyleSheet } from 'react-native';
import { colorGray, colorBlack } from '../../style/Colors';

const style = StyleSheet.create({

  commentContainer: {
    margin: 7,
    alignItems: 'center',
  },

  commentText: {
    fontStyle: 'italic',
    textAlign: 'center',
    fontSize: 14,
    margin: 10,
    color: colorGray,
  },

  speechContainer: {
    margin: 5,
    alignItems: 'center',
  },

  speechText: {
    textAlign: 'justify',
    fontSize: 14,
    margin: 10,
  },

  speakerIsSpeakerText: {
    fontWeight: 'bold',
    color: colorBlack,
  },

  speakerIsNotSpeakerText: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: colorBlack,
  },

  speakerNameContainer: {
    marginBottom: 5,
  },

});

export default style;
