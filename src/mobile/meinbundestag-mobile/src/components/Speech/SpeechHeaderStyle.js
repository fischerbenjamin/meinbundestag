import { StyleSheet } from 'react-native';
import { colorBlackLight } from '../../style/Colors';

const style = StyleSheet.create({

  container: {
    marginTop: 10,
    marginBottom: 10,
  },

  text: {
    fontWeight: 'bold',
    fontSize: 15,
    margin: 5,
    padding: 2,
    textAlign: 'center',
    color: colorBlackLight,
  },

  textTopic: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  analysisContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },

  analysisText: {
    marginLeft: 20,
    marginRight: 20,
  },

  moodIcon: {
    fontSize: 24,
    margin: 10,
    fontWeight: 'bold',
  },

});

export default style;
