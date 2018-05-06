import * as types from "./types";

const setSelectedElement = element => ({ type: types.SET_SELECTED_ELEMENT, payload: element });
const createElement = element => ({ type: types.CREATE_ELEMENT, payload: element });
const updateElement = element => ({ type: types.UPDATE_ELEMENT, payload: element });
const removeElement = element => ({ type: types.REMOVE_ELEMENT, payload: element });
const loadElements = elements => ({ type: types.LOAD_ELEMENTS, payload: elements });

export { setSelectedElement, createElement, updateElement, removeElement, loadElements };
