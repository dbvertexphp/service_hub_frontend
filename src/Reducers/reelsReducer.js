import { SET_REEL_DATA } from "../Actions/ActionTypes";

const initialState = {
  reelsData: { data: [] }, // Initialize with an object containing an empty array
};

const reelsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_REEL_DATA:
      return {
        ...state,
        reelsData: { data: [...state.reelsData.data, ...action.payload] }, // Append new data to existing data
      };
    // Add other cases as needed
    default:
      return state;
  }
};

export default reelsReducer;
