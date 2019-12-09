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

// FIXME: limit cache size
function cache(state = [], action) {
  switch (action.type) {
    case actionTypes.updateCache:
      return [
        ...state,
        action.profile,
      ];
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
