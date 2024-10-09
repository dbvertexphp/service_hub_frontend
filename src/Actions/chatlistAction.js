import { SET_CHAT_LIST_DATA } from "./ActionTypes.js";

export const setchatlist_data = (OfflineId, userId, myId) => ({
  type: "SET_CHAT_LIST_DATA",
  payload: { OfflineId, userId, myId },
});
