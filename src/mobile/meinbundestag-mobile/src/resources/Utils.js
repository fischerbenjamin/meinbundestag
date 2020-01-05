/**
 * @file Helper functions for the application
 * @author Benjamin Fischer
 *
 * Helper functions for api calls with/without checking the cache.
 */

import storage from '../storage/Store';


// FIXME: constant url of the server
const URL = 'http://localhost:3000';

// API calls to the server
const api = {

  /**
   * Fetches the names of all deputies from the server.
   * @function
   * @async
   * @return {array} list of deputies
   */
  deputies: async function fetchDeputies() {
    const route = `${URL}/deputies`;
    const response = await fetch(route);
    const names = await response.json();
    return names;
  },

  /**
   * Fetches the profile of given deputy from the server
   * @function
   * @async
   * @param {string} urlName - url name of the deputy
   * @return {object} profile
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
 * Compute the url name for a given full name of a deputy
 * @param {string} name - full name of the deputy
 * @return {string} url name that can be used for api calls
 */
function getUrlName(name) {
  const urlName = name.replace(/ /g, '-').toLowerCase();
  return urlName;
}

// Helper functions
const utils = {

  /**
   * Returns the profile for the given name. It checks if the profile is
   * already present in the cache and fetches it from the server if not.
   * Furthermore, the profile is cached if it wasn't present in the cache
   * before. Most importantly, it updates the redux store accordingly to the
   * changes as well.
   * @function
   * @async
   * @param {string} name - url name of the deputy
   * @return {object} profile
   */
  updateProfile: async function getProfile(name) {
    const urlName = getUrlName(name);
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
   * Returns the list of deputies either from the cache or the server.
   * @function
   * @async
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
