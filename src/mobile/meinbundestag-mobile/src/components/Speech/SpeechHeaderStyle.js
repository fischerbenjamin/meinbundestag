import { StyleSheet } from 'react-native';
import { colorBlackLight } from '../../style/Colors';

const style = StyleSheet.create({

  container: {
    marginTop: 10,
    marginBottom: 10,
  },

  text: {
    fontWeight: '500',
    fontSize: 16,
    margin: 5,
    padding: 2,
    textAlign: 'center',
    color: colorBlackLight,
  },

  textTopic: {
    fontSize: 18,
    fontWeight: '600',
  },

  analysisContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  analysisText: {
    marginLeft: 20,
    marginRight: 20,
  },

});

export default style;
