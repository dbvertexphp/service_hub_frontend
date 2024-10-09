// Reducers.js

import { SET_USER_PROFILE_DATA, SET_CHAT_DATA, UPDATE_CHAT_DATA } from "../Actions/ActionTypes";

const initialState = {
  selectedUser: null,
  chatPageData: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_PROFILE_DATA:
      return {
        ...state,
        selectedUser: action.payload,
      };
    case SET_CHAT_DATA:
      return {
        ...state,
        chatPageData: action.payload,
      };
    case UPDATE_CHAT_DATA:
      return {
        ...state,
        chatPageData: {
          ...state.chatPageData,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

export default userReducer;
