// store.js
import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk"; // Correct import
import authReducer from "./Reducers/authReducer";
import useractivityReducer from "./Reducers/useractivityReducer";
import chatReducer from "./Reducers/chatReducer";
import categoryReducer from "./Reducers/categoryReducer";
import reelsReducer from "./Reducers/reelsReducer";
import searchReducer from "./Reducers/searchReducer";
import notificationReducer from "./Reducers/notificationReducer";
import chatlistReducer from "./Reducers/chatlistReducer";
import userprofileReducer from "./Reducers/userprofileReducer";
import homepageReducer from "./Reducers/homepageReducer";

// Combine multiple reducers into a single rootReducer
const rootReducer = combineReducers({
  auth: authReducer,
  userActivity: useractivityReducer,
  chat: chatReducer,
  categoryReducer: categoryReducer,
  reelsReducer: reelsReducer,
  homepageReducer: homepageReducer,
  searchReducer: searchReducer,
  notificationReducer: notificationReducer,
  chatlistReducer: chatlistReducer,
  userprofileurlReducer: userprofileReducer,
});

// Create the Redux store with the combined rootReducer and apply redux-thunk middleware
const store = createStore(rootReducer, applyMiddleware(thunk)); // Correct usage

export default store;
