/**
 * @file Implementation of the storage object
 * @author Benjamin Fischer
 */

import { createStore } from 'redux';

import store from './Reducers';
import { actions } from './Actions';


// Inital state of the store.
const initialState = {
  personalContent: '',
  profile: {},
  speech: {},
  deputies: [],
  cache: [],
};

// Create the store with the combined reducers and the initial state.
const appStore = createStore(store, initialState);

// Wrapper to use in other modules.
const storage = {

  /**
   * Set the personal content of the redux store.
   * @param {string} content - type of personal content to display
   */
  setPersonalContent: function setPersonalContent(content) {
    appStore.dispatch(actions.setPersonalContent(content));
  },

  /**
   * Get the personal content of the redux store.
   * @return {string} type of personal content currently stored
   */
  getPersonalContent: function getPersonalContent() {
    const { personalContent } = appStore.getState();
    return personalContent;
  },

  /**
   * Set the profile of the redux store.
   * @param {object} profile - profile to store
   * @param {boolean} cache - true if the profile should be cached, false otherwise
   */
  setProfile: function setProfile(profile, cache) {
    appStore.dispatch(actions.setProfile(profile));
    if (cache) {
      appStore.dispatch(actions.cacheProfile(profile));
    }
  },

  /**
   * Set the speech stored in the redux store.
   * @param {object} speech - speech object
   */
  setSpeech: function setSpeech(speech) {
    appStore.dispatch(actions.setSpeech(speech));
  },

  /**
   * Set the deputies stored in the redux store.
   * @param {array} deputies - list of deputies
   */
  setDeputies: function setDeputies(deputies) {
    appStore.dispatch(actions.setDeputies(deputies));
  },

  /**
   * Get the profile stored in the redux store.
   * @return {object} profile stored in the redux store
   */
  getProfile: function getProfile() {
    const { profile } = appStore.getState();
    return profile;
  },

  /**
   * Get the speech stored in the redux store.
   * @return {object} speech stored in the redux store
   */
  getSpeech: function getSpeech() {
    const { speech } = appStore.getState();
    return speech;
  },

  /**
   * Get the deputies stored in the redux store.
   * @return {array} deputies stored in the redux store
   */
  getDeputies: function getDeputies() {
    const { deputies } = appStore.getState();
    return deputies;
  },

  /**
   * Search for the profile with given id in the cache of the redux store.
   * @param {string} id - unique identifier of the profile
   * @return {object} cached profile of undefined if not cached
   */
  findProfileInCache: function findProfileInCache(id) {
    const { cache } = appStore.getState();
    const result = cache.find((profile) => profile.id === id);
    return result;
  },

  /**
   * Log actions of the redux store to the console.
   */
  subscribeToConsole: function subscribeToConsole() {
    appStore.subscribe(() => console.log(appStore.getState())); // eslint-disable-line no-console
  },

  /**
   * Get the actual appStore object (use with caution!)
   * @return {object} appStore
   */
  getStore: function getStore() {
    return appStore;
  },

};

export default storage;
