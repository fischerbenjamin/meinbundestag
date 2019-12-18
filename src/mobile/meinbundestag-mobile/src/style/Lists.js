import { StyleSheet } from 'react-native';
import { colorLight, colorBlackLight } from './Colors';

const seperator = StyleSheet.create({

  default: {
    opacity: 0.5,
    borderRadius: 50,
    marginBottom: 10,
    marginTop: 10,
    height: 2,
    width: '90%',
    backgroundColor: colorLight,
    marginLeft: '5%',
    marginRight: '5%',
  },

});

const listItem = StyleSheet.create({

  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    marginTop: 5,
    marginBottom: 5,
    paddingRight: 10,
  },

  keyView: {
    flex: 2,
  },

  keyText: {
    flex: 1,
    textAlign: 'left',
    fontWeight: '600',
    color: colorBlackLight,
    paddingLeft: 20,
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

export {
  seperator,
  listItem,
};
