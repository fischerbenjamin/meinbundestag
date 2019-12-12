import { StyleSheet } from 'react-native';
import { colorGray, colorLight } from './Colors';

const profile = StyleSheet.create({

  container: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'stretch',
  },

  header: {
    flex: 1,
    borderBottomColor: colorGray,
    borderBottomWidth: 2,
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
    borderRadius: 63,
    borderWidth: 3,
    borderColor: colorLight,
    height: 140,
    width: 140,
  },

  headerName: {
    fontStyle: 'italic',
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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
  profile,
  entry,
};
