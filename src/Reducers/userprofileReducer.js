// Reducers.js

import { SET_USER_PROFILE_DATA } from "../Actions/ActionTypes";

const initialState = {
  profiledata: null, // initialState ko null kar diya hai
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_PROFILE_DATA:
      return {
        ...state,
        profiledata: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
