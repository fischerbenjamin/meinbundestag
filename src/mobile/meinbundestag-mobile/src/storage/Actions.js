const actionTypes = {
  setProfile: 'SET_PROFILE',
  setSpeech: 'SET_SPEECH',
  setDeputies: 'SET_DEPUTIES',
  updateCache: 'UPDATE_CACHE',
  setPersonalContent: 'SET_PERSONAL_CONTENT',
};

const actions = {

  // Set the personal content in the application (overview or certain item)
  setPersonalContent: function setPersonalContent(content) {
    const action = {
      type: actionTypes.setPersonalContent,
      content,
    };
    return action;
  },

  // Set the profile in the application
  setProfile: function setProfile(profile) {
    const action = {
      type: actionTypes.setProfile,
      profile,
    };
    return action;
  },

  // Set the speech in the application
  setSpeech: function setSpeech(speech) {
    const action = {
      type: actionTypes.setSpeech,
      speech,
    };
    return action;
  },

  // Set the list of deputies in the application
  setDeputies: function setDeputies(deputies) {
    const action = {
      type: actionTypes.setDeputies,
      deputies,
    };
    return action;
  },

  // Cache the given profile in the application
  cacheProfile: function cacheProfile(profile) {
    const action = {
      type: actionTypes.updateCache,
      profile,
    };
    return action;
  },

};

export { actions, actionTypes };
