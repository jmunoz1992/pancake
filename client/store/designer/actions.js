import * as types from "./types";

// Element Selection
const setSelectedElement = element => ({ type: types.SET_SELECTED_ELEMENT, payload: element });

// Element manipulation
const createElement = element => ({ type: types.CREATE_ELEMENT, payload: element });
const updateElement = element => ({ type: types.UPDATE_ELEMENT, payload: element });
const removeElement = element => ({ type: types.REMOVE_ELEMENT, payload: element });
const loadElements = elements => ({ type: types.LOAD_ELEMENTS, payload: elements });

// Network status
const setConnectionStatus = status => ({ type: types.SET_CONNECTION_STATUS, payload: status });

export { setSelectedElement, createElement, updateElement, removeElement, loadElements, setConnectionStatus };
