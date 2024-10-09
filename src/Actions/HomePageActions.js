import { SET_HOME_PAGE_DATA } from "./ActionTypes.js";

export const setHomePageData = (HomePageData) => {
  return {
    type: SET_HOME_PAGE_DATA,
    payload: HomePageData,
  };
};
