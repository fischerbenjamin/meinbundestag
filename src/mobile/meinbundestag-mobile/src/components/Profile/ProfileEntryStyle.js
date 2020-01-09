import { StyleSheet } from 'react-native';
import { colorBlackLight } from '../../style/Colors';

const style = StyleSheet.create({

  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    alignSelf: 'stretch',
  },

  descriptionView: {
    flex: 2,
  },

  descriptionText: {
    flex: 1,
    textAlign: 'left',
    fontWeight: '600',
    paddingLeft: 20,
    color: colorBlackLight,
  },

  valueView: {
    flex: 3,
  },

  valueText: {
    textAlign: 'left',
    paddingLeft: 10,
    paddingRight: 5,
  },

});

export default style;
