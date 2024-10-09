import { SET_REEL_DATA } from "./ActionTypes.js";

export const setReelsData = (reelsData) => {
  return {
    type: SET_REEL_DATA,
    payload: reelsData,
  };
};
