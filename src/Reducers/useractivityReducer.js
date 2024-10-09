// userActivityReducer.js
import {
  SET_LIKE_COUNT,
  SIDEBAR_INDEX_NUMBER,
  SET_REELS_CATEGORY_BOX,
  SET_COMMENTS_STATUS,
  SET_PLAY_PAUSE,
  SET_BACK_BUTTON_REELS,
  SET_COMMENT_COUNT,
  SET_NOTIFICATION_TYPE,
} from "../Actions/ActionTypes"; // Define your actionTypes path

const initialState = {
  likeCounts: {}, // Initial state for like counts
  sidebarindexNumber: 0,
  boxclosestatus: false,
  comments_box_status: false,
  PlayPauseStatus: "",
  BackButtonReel: 0,
  Comment_Count: "",
  Notification_Type: "My_Club",
};

const userActivityReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LIKE_COUNT:
      const updatedLikeCounts = { ...state.likeCounts };
      const currentCount = updatedLikeCounts[action.timelineId] || 0;

      // Check TypeNumber for increment or decrement
      updatedLikeCounts[action.timelineId] =
        action.TypeNumber === "1" ? Math.max(currentCount + 1, 0) : Math.max(currentCount - 1, 0);

      return {
        ...state,
        likeCounts: updatedLikeCounts,
      };
    case SIDEBAR_INDEX_NUMBER:
      return {
        ...state,
        sidebarindexNumber: action.payload,
      };
    case SET_REELS_CATEGORY_BOX:
      return {
        ...state,
        boxclosestatus: action.payload,
      };
    case SET_COMMENTS_STATUS:
      return {
        ...state,
        comments_box_status: action.payload,
      };
    case SET_PLAY_PAUSE:
      return {
        ...state,
        PlayPauseStatus: action.payload,
      };

    case SET_BACK_BUTTON_REELS:
      return {
        ...state,
        BackButtonReel: action.payload,
      };

    case SET_COMMENT_COUNT:
      return {
        ...state,
        Comment_Count: action.payload,
      };

    case SET_NOTIFICATION_TYPE:
      return {
        ...state,
        Notification_Type: action.payload,
      };

    default:
      return state;
  }
};

export default userActivityReducer;
