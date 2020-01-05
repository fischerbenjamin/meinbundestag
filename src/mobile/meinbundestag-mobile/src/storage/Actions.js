/**
 * @file Actions of the redux store
 * @author Benjamin Fischer
 */

// Types of actions that can be performed on the redux store
const actionTypes = {
  setProfile: 'SET_PROFILE',
  setSpeech: 'SET_SPEECH',
  setDeputies: 'SET_DEPUTIES',
  updateCache: 'UPDATE_CACHE',
  setPersonalContent: 'SET_PERSONAL_CONTENT',
};

// Actions that can be performed on the redux store
const actions = {

  /**
   * Return the action for setting the content type in the redux store.
   * This type determines which view is shown in the personal screen.
   * @param {string} content - type of content
   * @return {object} - action
   */
  setPersonalContent: function setPersonalContent(content) {
    const action = {
      type: actionTypes.setPersonalContent,
      content,
    };
    return action;
  },

  /**
   * Return the action for setting the profile in the redux store.
   * @param {object} profile - profile to set
   * @return {object} - action
   */
  setProfile: function setProfile(profile) {
    const action = {
      type: actionTypes.setProfile,
      profile,
    };
    return action;
  },

  /**
   * Return the action for setting the speech in the redux store.
   * @param {object} speech - speech to set
   * @return {object} - action
   */
  setSpeech: function setSpeech(speech) {
    const action = {
      type: actionTypes.setSpeech,
      speech,
    };
    return action;
  },

  /**
   * Return the action for setting the list of deputies in the redux store.
   * @param {array} deputies - deputies to store
   * @return {object} - action
   */
  setDeputies: function setDeputies(deputies) {
    const action = {
      type: actionTypes.setDeputies,
      deputies,
    };
    return action;
  },

  /**
   * Return the action for caching a profile in the redux store.
   * @param {object} profile - profile to cache
   * @return {object} - action
   */
  cacheProfile: function cacheProfile(profile) {
    const action = {
      type: actionTypes.updateCache,
      profile,
    };
    return action;
  },

};

export { actions, actionTypes };
