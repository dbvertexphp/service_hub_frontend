import { SET_SREACH_DATA } from "./ActionTypes.js";

export const setSearch_data = (search_data) => {
  return {
    type: SET_SREACH_DATA,
    payload: search_data,
  };
};
