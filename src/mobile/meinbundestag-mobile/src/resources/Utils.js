import storage from '../storage/Store';

const URL = 'http://localhost:3000';

const api = {

  deputies: async function fetchDeputies() {
    const route = `${URL}/deputies`;
    const response = await fetch(route);
    const names = await response.json();
    return names;
  },

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

function getUrlName(name) {
  const urlName = name.replace(/ /g, '-').toLowerCase();
  return urlName;
}

const utils = {

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
