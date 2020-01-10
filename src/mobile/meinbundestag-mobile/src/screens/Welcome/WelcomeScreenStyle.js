import { StyleSheet } from 'react-native';
import { colorMain, colorWhite } from '../../style/Colors';

const style = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: colorMain,
    alignItems: 'center',
    justifyContent: 'center',
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    color: colorWhite,
    fontSize: 18,
    textAlign: 'center',
  },

  textHeading: {
    color: colorWhite,
    fontSize: 32,
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: 'bold',
  },

  textError: {
    marginTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },

});

export default style;
