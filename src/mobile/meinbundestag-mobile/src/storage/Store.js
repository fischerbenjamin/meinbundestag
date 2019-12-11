import { createStore } from 'redux';
import store from './Reducers';
import { actions } from './Actions';


const initialState = {
  profile: {},
  speech: {},
  cache: [],
};

const appStore = createStore(store, initialState);

const storage = {

  setProfile: function setProfile(profile) {
    appStore.dispatch(actions.setProfile(profile));
  },

  setSpeech: function setSpeech(speech) {
    appStore.dispatch(actions.setSpeech(speech));
  },

  updateCache: function updateCache(profile) {
    appStore.dispatch(actions.cacheProfile(profile));
  },

  appStore,

};

export default storage;
