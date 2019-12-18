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
    appStore.dispatch(actions.cacheProfile(profile));
  },

  setSpeech: function setSpeech(speech) {
    appStore.dispatch(actions.setSpeech(speech));
  },

  getProfile: function getProfile() {
    const { profile } = appStore.getState();
    return profile;
  },

  getSpeech: function getSpeech() {
    const { speech } = appStore.getState();
    return speech;
  },

  subscribeToConsole: function subscribeToConsole() {
    appStore.subscribe(() => console.log(appStore.getState()));
  },

  getStore: function getStore() {
    return appStore;
  },

};

export default storage;
