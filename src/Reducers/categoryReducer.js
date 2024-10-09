import { SET_CATEGORY_ID } from "../Actions/ActionTypes";

const initialcategory_id = "";
const initialState = {
  category_id: initialcategory_id,
};

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CATEGORY_ID:
      return {
        ...state,
        category_id: action.payload,
      };
    // Add other cases as needed
    default:
      return state;
  }
};

export default categoryReducer;
