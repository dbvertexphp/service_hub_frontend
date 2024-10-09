import { SET_SREACH_DATA } from "../Actions/ActionTypes";

const initialsearch_data = "";
const initialState = {
  search_data: initialsearch_data,
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SREACH_DATA:
      return {
        ...state,
        search_data: action.payload,
      };
    // Add other cases as needed
    default:
      return state;
  }
};

export default searchReducer;
