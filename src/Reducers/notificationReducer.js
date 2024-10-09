import { SET_NOTIFICATION_DATA } from "../Actions/ActionTypes";

const initialsearch_data = "";
const initialState = {
  notificationData: initialsearch_data,
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_NOTIFICATION_DATA:
      return {
        ...state,
        notificationData: action.payload,
      };
    // Add other cases as needed
    default:
      return state;
  }
};

export default notificationReducer;
