import { combineReducers } from "redux";
import * as types from "./types";

const selectedElementReducer = (state = 0, action) => {
  switch (action.type) {
    case types.SET_SELECTED_ELEMENT:
      return action.payload.id;
    default:
      return state;
  }
};

const elementReducer = (state = [], action) => {
  switch (action.type) {
    case types.CREATE_ELEMENT:
      return [action.payload, ...state];
    case types.UPDATE_ELEMENT:
      return state.map(element => (action.payload.id === element.id ? action.payload : element));
    case types.REMOVE_ELEMENT:
      return state.filter(element => element.id === action.payload.id);
    case types.LOAD_ELEMENTS:
      return action.payload;
    default:
      return state;
  }
};

const networkStatusReducer = (state = { connecting: false, connected: false, error: "" }, action) => {
  switch (action.type) {
    case types.SET_CONNECTION_STATUS:
      return action.payload;
    default:
      return state;
  }
};

const reducer = combineReducers({
  selectedElement: selectedElementReducer,
  elements: elementReducer,
  networkStatus: networkStatusReducer
});

export default reducer;
