// AuthActions.js
import {
  SET_MOBILE_NUMBER,
  SET_FORGET_PASSWORD_MESSAGE,
  TOGGLE_SIDEBAR,
  SIDEBAR_NUMBER,
} from "./ActionTypes.js";

export const setMobileNumber = (mobileNumber) => {
  localStorage.setItem("mobileNumber", mobileNumber);
  return {
    type: SET_MOBILE_NUMBER,
    payload: mobileNumber,
  };
};

export const setForgetseccfullymessage = () => {
  return {
    type: SET_FORGET_PASSWORD_MESSAGE,
    payload: "Your password has been successfully forgotten. Please login with the new password.",
  };
};

export const toggleSidebar = () => {
  return {
    type: TOGGLE_SIDEBAR,
  };
};

export const setSidebarNumber = (sidebarnumber) => {
  return {
    type: SIDEBAR_NUMBER,
    payload: sidebarnumber,
  };
};
