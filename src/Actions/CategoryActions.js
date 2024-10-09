import { SET_CATEGORY_ID } from "./ActionTypes.js";

export const setCategory_id = (category_id) => {
  return {
    type: SET_CATEGORY_ID,
    payload: category_id,
  };
};
