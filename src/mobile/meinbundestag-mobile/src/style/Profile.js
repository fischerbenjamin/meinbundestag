import { StyleSheet } from 'react-native';
import { colorLight, colorMain, colorWhite, colorBlack, colorBlackLight } from './Colors';

const profile = StyleSheet.create({

  container: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'stretch',
  },

  header: {
    flex: 1,
  },

  headerImageView: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerNameView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  headerImage: {
    marginTop: 5,
    borderRadius: 96,
    height: 192,
    width: 192,
  },

  headerName: {
    fontStyle: 'italic',
    fontWeight: 'bold',
  },

  headerSeparator: {
    borderRadius: 10,
    borderBottomColor: colorMain,
    borderBottomWidth: 3,
    width: '90%',
    marginLeft: '5%',
    marginRight: '5%',
    margin: 10,
  },

  body: {
    flex: 2,
    justifyContent: 'space-around',
  },

});

const entry = StyleSheet.create({

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

export {
  profile,
  entry,
};
