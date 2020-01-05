import { StyleSheet } from 'react-native';
import { colorMain } from '../../style/Colors';

const style = StyleSheet.create({

  activityIndicatorView: {
    margin: 10,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorMessage: {
    fontSize: 18,
    color: colorMain,
    fontStyle: 'italic',
    fontWeight: '500',
  },

  searchBox: {
    padding: 15,
    margin: 10,
    marginTop: 20,
    fontSize: 18,
    borderWidth: 2,
    borderRadius: 20,
    textAlign: 'center',
    outlineColor: 'white',
    borderColor: colorMain,
    fontWeight: '500',
  },

  suggestionsView: {
    flex: 4,
    alignItems: 'center',
  },

  container: {
    flex: 1,
    margin: 10,
  },

  buttonView: {
    flex: 1,
    alignItems: 'center',
  },

  button: {
    alignSelf: 'center',
    backgroundColor: colorMain,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colorMain,
    padding: 10,
    margin: 10,
    width: '66%',
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 28,
    padding: 5,
    fontWeight: 'bold',
  },

});

export default style;
