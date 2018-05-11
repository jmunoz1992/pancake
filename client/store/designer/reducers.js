import { combineReducers } from "redux";
import * as types from "./types";

const selectedElementsReducer = (state = [], action) => {
  switch (action.type) {
    case types.SET_SELECTED_ELEMENTS:
      return [...action.payload];
    case types.ADD_ELEMENTS_TO_SELECTION: {
      const elementSet = new Set(state);
      action.payload.forEach(element => elementSet.add(element));
      return [...elementSet];
    }
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
    case types.BULK_UPDATE_ELEMENTS: {
      const elementMap = new Map(action.payload.map(element => [element.id, element]));
      return state.map(element => {
        const updatedElement = elementMap.get(element.id);
        return updatedElement ? updatedElement : element;
      });
    }
    case types.REMOVE_ELEMENT:
      return state.filter(element => element.id !== action.payload.id);
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

const configReducer = (state = { editMode: true }, action) => {
  switch (action.type) {
    case types.SET_EDIT_MODE:
      return { ...state, editMode: action.payload };
    default:
      return state;
  }
};

const reducer = combineReducers({
  selectedElements: selectedElementsReducer,
  elements: elementReducer,
  networkStatus: networkStatusReducer,
  config: configReducer
});

export default reducer;
