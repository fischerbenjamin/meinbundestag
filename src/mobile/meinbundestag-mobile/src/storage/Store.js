import { createStore } from 'redux';
import store from './Reducers';
import { actions } from './Actions';


const initialState = {
  profile: {},
  speech: {},
  deputies: [],
  cache: [],
};

const appStore = createStore(store, initialState);

const storage = {

  setProfile: function setProfile(profile, cache) {
    appStore.dispatch(actions.setProfile(profile));
    if (cache) {
      appStore.dispatch(actions.cacheProfile(profile));
    }
  },

  setSpeech: function setSpeech(speech) {
    appStore.dispatch(actions.setSpeech(speech));
  },

  setDeputies: function setDeputies(deputies) {
    appStore.dispatch(actions.setDeputies(deputies));
  },

  getProfile: function getProfile() {
    const { profile } = appStore.getState();
    return profile;
  },

  getSpeech: function getSpeech() {
    const { speech } = appStore.getState();
    return speech;
  },

  getDeputies: function getDeputies() {
    const { deputies } = appStore.getState();
    return deputies;
  },

  findProfileInCache: function findProfileInCache(id) {
    const { cache } = appStore.getState();
    const result = cache.find((profile) => profile.id === id);
    if (result !== undefined) {
      console.log('FOUND PROFILE IN CACHE');
    }
    return result;
  },

  subscribeToConsole: function subscribeToConsole() {
    appStore.subscribe(() => console.log(appStore.getState()));
  },

  getStore: function getStore() {
    return appStore;
  },

};

export default storage;
