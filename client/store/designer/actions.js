import * as types from "./types";

// Element Selection
const setSelectedElements = element => ({ type: types.SET_SELECTED_ELEMENTS, payload: element });
const addElementsToSelection = elements => ({ type: types.ADD_ELEMENTS_TO_SELECTION, payload: elements });

// Element manipulation
const createElement = element => ({ type: types.CREATE_ELEMENT, payload: element });
const updateElement = element => ({ type: types.UPDATE_ELEMENT, payload: element });
const bulkUpdateElements = elements => ({ type: types.BULK_UPDATE_ELEMENTS, payload: elements });
const removeElement = element => ({ type: types.REMOVE_ELEMENT, payload: element });
const loadElements = elements => ({ type: types.LOAD_ELEMENTS, payload: elements });

// Network status
const setConnectionStatus = status => ({ type: types.SET_CONNECTION_STATUS, payload: status });

// Designer configuration
const setEditMode = mode => ({ type: types.SET_EDIT_MODE, payload: mode });

export {
  setSelectedElements,
  addElementsToSelection,
  createElement,
  updateElement,
  bulkUpdateElements,
  removeElement,
  loadElements,
  setConnectionStatus,
  setEditMode
};
