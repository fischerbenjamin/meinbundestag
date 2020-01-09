import { combineReducers } from 'redux';
import { actionTypes } from './Actions';

/**
 * @file Reducers of the app store
 * @author Benjamin Fischer
 * @module Reducers
 */


/**
 * Reducer for setting the personal content type of the application.
 * @param {string} [state=''] - current content type
 * @param {Object} action - action to perform
 * @return {string} updated content type
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
 * @param {Object} [state={}] - current profile
 * @param {Object} action - action to perform
 * @return {Object} updated profile
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
 * @param {Object} [state={}] - current speech
 * @param {Object} action - action to perform
 * @return {Object} updated speech
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
 * @param {array} [state=[]] - current deputies
 * @param {Object} action - action to perform
 * @return {array} updated deputies
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
 * @param {array} [state=[]] - current cache
 * @param {object} action - action to perform
 * @return {array} updated cache
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

// Combine all reducers
const store = combineReducers({
  profile,
  speech,
  deputies,
  cache,
  personalContent,
});

export default store;
