// Actions.js

import { SET_CHAT_ID, SET_CHAT_DATA, UPDATE_CHAT_DATA } from "./ActionTypes"; // Assuming you have an action type defined
import { WebsiteApi } from "../Api/WebsiteApi"; // Update with correct path

// Action to set chat data
export const saveChatData = (chatPageData) => ({
  type: SET_CHAT_DATA,
  payload: chatPageData,
});

// New action to update chat data
export const updateChatData = (updatedChatData) => ({
  type: UPDATE_CHAT_DATA,
  payload: updatedChatData,
});

// Thunk action creator
export const setChatId = (userId) => async (dispatch) => {
  try {
    const response = await WebsiteApi.ChatCreate(userId);
    if (response && response.status) {
      const selectedUser = response._id;
      dispatch({
        type: SET_CHAT_ID,
        payload: selectedUser,
      });
      // Optionally, you can return the selected user for further use
      return selectedUser;
    } else {
      console.error("Invalid API response format:", response);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};
