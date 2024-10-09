// Actions.js

import { SET_USER_PROFILE_DATA } from "./ActionTypes"; // Assuming you have an action type defined
import { getUserdataCookie } from "cookies";

// Thunk action creator
export const setProfileUrl = (userId) => async (dispatch) => {
  try {
    const ownUser = getUserdataCookie("Userdata");
    let profiledata;
    if (ownUser._id === userId) {
      profiledata = "/website-my-profile-view";
    } else {
      profiledata = `/Website-user-profile-view/${userId}`;
    }
    dispatch({
      type: SET_USER_PROFILE_DATA,
      payload: profiledata,
    });
    return profiledata; // Returning the profiledata
  } catch (error) {
    console.error("Error setting profile URL:", error);
    return null; // Returning null in case of error
  }
};
