// UserActivity.js
import {
  SET_LIKE_COUNT,
  SIDEBAR_INDEX_NUMBER,
  SET_REELS_CATEGORY_BOX,
  SET_COMMENTS_STATUS,
  SET_PLAY_PAUSE,
  SET_BACK_BUTTON_REELS,
  SET_COMMENT_COUNT,
  SET_NOTIFICATION_TYPE,
} from "./ActionTypes";

export const setLikeCount = (timelineId, TypeNumber, likeCount) => ({
  type: SET_LIKE_COUNT,
  timelineId,
  likeCount,
  TypeNumber,
  PlayPauseStatus,
});

export const set_SidebarIndexNumber = (sidebarindexNumber) => {
  return {
    type: SIDEBAR_INDEX_NUMBER,
    payload: sidebarindexNumber,
  };
};

export const set_ReelscategoryBoxClose = (boxclosestatus) => {
  return {
    type: SET_REELS_CATEGORY_BOX,
    payload: boxclosestatus,
  };
};

export const set_CommentsStatus = (comments_box_status) => {
  return {
    type: SET_COMMENTS_STATUS,
    payload: comments_box_status,
  };
};
export const set_Play_Pause = (PlayPauseStatus) => {
  return {
    type: SET_PLAY_PAUSE,
    payload: PlayPauseStatus,
  };
};
export const set_BackButtonReel = (BackButtonReel) => {
  return {
    type: SET_BACK_BUTTON_REELS,
    payload: BackButtonReel,
  };
};
export const set_Comment_Count = (Comment_Count) => {
  return {
    type: SET_COMMENT_COUNT,
    payload: Comment_Count,
  };
};

export const set_Notification_Type = (Notification_Type) => {
  return {
    type: SET_NOTIFICATION_TYPE,
    payload: Notification_Type,
  };
};
