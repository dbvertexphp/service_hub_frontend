// authReducer.js
import {
  SET_MOBILE_NUMBER,
  SET_FORGET_PASSWORD_MESSAGE,
  TOGGLE_SIDEBAR,
  SIDEBAR_NUMBER,
} from "../Actions/ActionTypes";

const initialMobileNumber = localStorage.getItem("mobileNumber") || "";
const initialState = {
  mobileNumber: initialMobileNumber,
  forgetPasswordMessage: "",
  sidebarOpen: false,
  user: null,
  sidebarnumber: 1,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MOBILE_NUMBER:
      return {
        ...state,
        mobileNumber: action.payload,
      };
    case SET_FORGET_PASSWORD_MESSAGE:
      return {
        ...state,
        forgetPasswordMessage: action.payload,
      };
    case TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };
    case SIDEBAR_NUMBER:
      return {
        ...state,
        sidebarnumber: action.payload,
      };
    // Add other cases as needed
    default:
      return state;
  }
};

export default authReducer;
