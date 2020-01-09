/**
 * @author Benjamin Fischer
 * @description Actions of the app store
 * @module Actions
 */


/**
 * Types of action that can be performed on the app store
 * @type {Object.<string, string>}
 * @property {string} setProfile - action type for setting the profile
 * @property {string} setSpeech - action type for setting the speech
 * @property {string} setDeputies - action type for setting the deputies
 * @property {string} updateCache - action type for updating the cache
 * @property {string} setPersonalContent - action type for setting the personal content type
 */
const actionTypes = {
  setProfile: 'SET_PROFILE',
  setSpeech: 'SET_SPEECH',
  setDeputies: 'SET_DEPUTIES',
  updateCache: 'UPDATE_CACHE',
  setPersonalContent: 'SET_PERSONAL_CONTENT',
};

/**
 * Actions that can be performed on the app store
 * @namespace actions
 */
const actions = {

  /**
   * @summary Set the type of personal content to display in the application
   * @description
   * Return the action for setting the content type in the app store.
   * This type determines which view is shown in the personal screen.
   * @param {string} content - type of content
   * @return {Object} the action to perform
   */
  setPersonalContent: function setPersonalContent(content) {
    const action = {
      type: actionTypes.setPersonalContent,
      content,
    };
    return action;
  },

  /**
   * @summary Set the profile to display in the application
   * @description
   * Return the action for setting the profile in the app store.
   * The profile is displayed on the profile screen.
   * @param {Object} profile - deputy's profile
   * @return {Object} the action to perform
   */
  setProfile: function setProfile(profile) {
    const action = {
      type: actionTypes.setProfile,
      profile,
    };
    return action;
  },

  /**
   * @summary Set the speech to display in the application
   * @description
   * Return the action for setting speech in the app store.
   * The speech is displayed on the speech screen.
   * @param {Object} speech - speech to display
   * @return {Object} the action to perform
   */
  setSpeech: function setSpeech(speech) {
    const action = {
      type: actionTypes.setSpeech,
      speech,
    };
    return action;
  },

  /**
   * @summary Set the list of deputies in the application
   * @description
   * Return the action for setting the list of deputies in the app store.
   * This list is required for the suggestions made during the user's input
   * @param {array} deputies - array of deputies
   * @return {Object} the action to perform
   */
  setDeputies: function setDeputies(deputies) {
    const action = {
      type: actionTypes.setDeputies,
      deputies,
    };
    return action;
  },

  /**
   * @summary Cache the given profile in the app store
   * @description
   * Return the action for caching the profile in the app store.
   * Caching the profile prevents the application from fetching the profile
   * from the server again.
   * @param {Object} profile - deputy's profile to cache
   * @return {Object} the action to perform
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
