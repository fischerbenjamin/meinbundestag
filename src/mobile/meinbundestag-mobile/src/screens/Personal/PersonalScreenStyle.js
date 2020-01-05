import { StyleSheet } from 'react-native';
import { colorMain, colorWhite } from '../../style/Colors';


const style = StyleSheet.create({

  overviewContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-around',
  },

  overviewItemContainer: {
    flex: 1,
    backgroundColor: colorMain,
    borderRadius: 30,
    margin: 25,
  },

  overviewItemText: {
    fontWeight: 'bold',
    fontSize: 22,
    color: colorWhite,
  },

  overviewItemTextContainer: {
    flex: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  overviewSeparatorContainer: {
    flex: 1,
  },

  overviewIconContainer: {
    flex: 2,
    alignSelf: 'center',
    justifyContent: 'center',
  },

  overviewTouchableContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },

  backToOverviewButton: {
    alignSelf: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: colorMain,
    borderRadius: 20,
    margin: 10,
    marginTop: 20,
    width: '50%',
  },

  backToOverviewText: {
    color: colorWhite,
    fontWeight: '700',
  },

  backToOverviewSep: {
    borderRadius: 10,
    borderBottomColor: colorMain,
    borderBottomWidth: 3,
    width: '90%',
    marginLeft: '5%',
    marginRight: '5%',
    margin: 10,
  },

});

export default style;
