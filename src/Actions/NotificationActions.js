import { SET_NOTIFICATION_DATA } from "./ActionTypes.js";

export const setNotificationData = (notificationData) => {
  console.log(notificationData);
  return {
    type: SET_NOTIFICATION_DATA,
    payload: notificationData,
  };
};
