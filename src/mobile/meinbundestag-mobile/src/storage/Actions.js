const actionTypes = {
  setProfile: 'SET_PROFILE',
  setSpeech: 'SET_SPEECH',
  setDeputies: 'SET_DEPUTIES',
  updateCache: 'UPDATE_CACHE',
};

const actions = {

  setProfile: function setProfile(profile) {
    const action = {
      type: actionTypes.setProfile,
      profile,
    };
    return action;
  },

  setSpeech: function setSpeech(speech) {
    const action = {
      type: actionTypes.setSpeech,
      speech,
    };
    return action;
  },

  setDeputies: function setDeputies(deputies) {
    const action = {
      type: actionTypes.setDeputies,
      deputies,
    };
    return action;
  },

  cacheProfile: function cacheProfile(profile) {
    const action = {
      type: actionTypes.updateCache,
      profile,
    };
    return action;
  },

};

export { actions, actionTypes };
