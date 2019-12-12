import { combineReducers } from 'redux';
import { actionTypes } from './Actions';

function profile(state = {}, action) {
  switch (action.type) {
    case actionTypes.setProfile:
      return action.profile;
    default:
      return state;
  }
}

function speech(state = {}, action) {
  switch (action.type) {
    case actionTypes.setSpeech:
      return action.speech;
    default:
      return state;
  }
}

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

const store = combineReducers({
  profile,
  speech,
  cache,
});

export default store;
