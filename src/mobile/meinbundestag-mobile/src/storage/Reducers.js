/**
 * @file Reducers of the redux store
 * @author Benjamin Fischer
 */

import { combineReducers } from 'redux';
import { actionTypes } from './Actions';

/**
 * Reducer for setting the personal content type of the application.
 * @function
 * @param {string} state - current state (default: '')
 * @param {object} action - action object
 * @return {string} new state
 */
function personalContent(state = '', action) {
  switch (action.type) {
    case actionTypes.setPersonalContent:
      return action.content;
    default:
      return state;
  }
}

/**
 * Reducer for setting the profile of the application.
 * @function
 * @param {object} state - current state (default: {})
 * @param {object} action - action object
 * @return {object} new state
 */
function profile(state = {}, action) {
  switch (action.type) {
    case actionTypes.setProfile:
      return action.profile;
    default:
      return state;
  }
}

/**
 * Reducer for setting the speech of the application.
 * @function
 * @param {object} state - current state (default: {})
 * @param {object} action - action object
 * @return {object} new state
 */
function speech(state = {}, action) {
  switch (action.type) {
    case actionTypes.setSpeech:
      return action.speech;
    default:
      return state;
  }
}

/**
 * Reducer for setting the list of deputies of the application.
 * @function
 * @param {array} state - current state (default: [])
 * @param {object} action - action object
 * @return {array} new state
 */
function deputies(state = [], action) {
  switch (action.type) {
    case actionTypes.setDeputies:
      return action.deputies;
    default:
      return state;
  }
}

/**
 * Reducer for handling the cache of the application.
 * @function
 * @param {array} state - current state (default: {})
 * @param {object} action - action object
 * @return {array} new state
 */
function cache(state = [], action) {
  const CACHE_SIZE = 10;
  switch (action.type) {
    case actionTypes.updateCache: {
      const newCache = state.concat([action.profile]);
      if (newCache.length === (CACHE_SIZE + 1)) {
        newCache.shift();
      }
      return newCache;
    }
    default:
      return state;
  }
}

// Combine all reducers.
const store = combineReducers({
  profile,
  speech,
  deputies,
  cache,
  personalContent,
});

export default store;
