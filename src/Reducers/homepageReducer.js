import { SET_HOME_PAGE_DATA } from "../Actions/ActionTypes";

const initialState = {
  videoList: {
    data: [],
  },
  reelsList: {
    data: [],
  },
  jobList: {
    data: [],
  },
  timelineList: {
    data: [],
  },
};

const HomePageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_HOME_PAGE_DATA:
      return {
        ...state,
        HomePageData: action.payload, // Append new data to existing data
      };
    // Add other cases as needed
    default:
      return state;
  }
};

export default HomePageReducer;
