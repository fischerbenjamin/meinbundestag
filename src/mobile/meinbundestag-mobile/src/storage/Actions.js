const actionTypes = {
  setProfile: 'SET_PROFILE',
  setSpeech: 'SET_SPEECH',
  setDeputies: 'SET_DEPUTIES',
  updateCache: 'UPDATE_CACHE',
  setPersonalContent: 'SET_PERSONAL_CONTENT',
};

const actions = {

  setPersonalContent: function setPersonalContent(content) {
    const action = {
      type: actionTypes.setPersonalContent,
      content,
    };
    return action;
  },

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
