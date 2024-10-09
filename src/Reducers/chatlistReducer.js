import { SET_CHAT_LIST_DATA } from "../Actions/ActionTypes";

const initialchatlist_data = {};
const initialState = {
  chatlist_data: initialchatlist_data,
};

const chatlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CHAT_LIST_DATA:
      return {
        ...state,
        chatlist_data: {
          OfflineId: action.payload.OfflineId,
          userId: action.payload.userId,
          myId: action.payload.myId,
        },
      };
    // Add other cases as needed
    default:
      return state;
  }
};

export default chatlistReducer;
