const actionTypes = {
  setProfile: 'SET_PROFILE',
  setSpeech: 'SET_SPEECH',
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

  cacheProfile: function cacheProfile(profile) {
    const action = {
      type: actionTypes.updateCache,
      profile,
    };
    return action;
  },

};

export { actions, actionTypes };
