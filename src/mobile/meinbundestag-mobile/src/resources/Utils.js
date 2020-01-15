import storage from '../storage/Store';
import API_URL from '../../config';


/**
 * @author Benjamin Fischer
 * @description Helper functions for the application
 * @module Utils
 */


// URL of the backend
const URL = API_URL;

/**
 * @namespace api
 */
const api = {

  /**
   * @summary Fetch the names of all deputies from the server.
   * @return {array} list of deputies
   */
  deputies: async function fetchDeputies() {
    const route = `${URL}/deputies`;
    const response = await fetch(route);
    const names = await response.json();
    return names;
  },

  /**
   * @summary Fetch the profile of given deputy from the server
   * @param {string} urlName - url name of the deputy
   * @return {Object} profile
   */
  profile: async function fetchProfile(urlName) {
    const route = `${URL}/profile/${urlName}`;
    const response = await fetch(route);
    const profile = await response.json();
    if (profile === null) {
      return undefined;
    }
    profile.id = urlName;
    return profile;
  },

};


/**
 * @namespace helper
 */
const helper = {

  /**
   * @summary Compute the url name for a given full name of a deputy
   * @param {string} name - full name of the deputy
   * @return {string} url name that can be used for api calls
   */
  getUrlName: function getUrlName(name) {
    const urlName = name.replace(/ /g, '-').toLowerCase();
    return urlName;
  },

};


/**
 * @namespace utils
 */
const utils = {

  /**
   * @summary Get profile data from the server
   * @description
   * Returns the profile for the given name. It checks if the profile is
   * already present in the cache and fetches it from the server if not.
   * Furthermore, the profile is cached if it wasn't present in the cache
   * before. Most importantly, it updates the redux store accordingly to the
   * changes as well.
   * @param {string} name - url name of the deputy
   * @return {Object} profile
   */
  updateProfile: async function getProfile(name) {
    const urlName = helper.getUrlName(name);
    const cacheResult = storage.findProfileInCache(urlName);
    // Clear other screens
    storage.setPersonalContent('');
    storage.setSpeech({});
    if (cacheResult !== undefined) {
      storage.setProfile(cacheResult, false);
      return cacheResult;
    }
    const profile = await api.profile(urlName);
    if (profile === undefined) {
      return undefined;
    }
    storage.setProfile(profile, true);
    return profile;
  },

  /**
   * @summary Return the list of deputies
   * @description
   * First, check if the list of deputies is already present in the cache.
   * If this is the case, return this list. Otherwise, fetch the data from
   * the server.
   * @return {array} deputies
   */
  getDeputies: async function getDeputies() {
    let deputies = storage.getDeputies();
    if (deputies.length !== 0) {
      return deputies;
    }
    deputies = await api.deputies();
    storage.setDeputies(deputies);
    return deputies;
  },

};

export default utils;
