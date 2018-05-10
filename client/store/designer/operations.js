import * as actions from "./actions";
import { dispatchNetworkAction, connectToSession, disconnectFromSession } from "../../socket";

// Element Selection
const selectElement = element => dispatch => {
  dispatch(actions.setSelectedElement(element));
};

// Element manipulation
const createNewElement = element => (dispatch, getState) => {
  element.id = "uninitialized";
  element.zIndex = getState().designer.elements.length;
  dispatchNetworkAction(actions.createElement(element));
};

const moveElement = (element, newPosition) => (dispatch, getState) => {
  element.top = newPosition.y;
  element.left = newPosition.x;
  dispatchNetworkAction(actions.updateElement(element));
};

const updateElementProperty = (element, property, newValue) => (dispatch, getState) => {
  element[property] = newValue;
  dispatchNetworkAction(actions.updateElement(element));
};

const deleteElement = element => dispatch => {
  dispatchNetworkAction(actions.removeElement(element));
};

const resizeElement = (element, newSize) => (dispatch, getState) => {
  element.width = newSize.width;
  element.height = newSize.height;
  element.left = newSize.x;
  element.top = newSize.y;
  dispatchNetworkAction(actions.updateElement(element));
};

// Network/Session
const loadMockup = () => (dispatch, getState) => {
  dispatch(actions.loadElements([]));
  connectToSession(getState().mockups.selectedMockup);
};

const disconnect = () => (dispatch, getState) => {
  dispatch(actions.loadElements([]));
  disconnectFromSession(getState().mockups.selectedMockup);
};

const setConnecting = () => (dispatch, getState) => {
  const status = {
    connecting: true,
    connected: false,
    error: ""
  };
  dispatch(actions.setConnectionStatus(status));
};

const setReconnecting = () => (dispatch, getState) => {
  const status = {
    connecting: true,
    connected: false,
    error: "Reconnecting..."
  };
  dispatch(actions.setConnectionStatus(status));
};

const setConnected = () => (dispatch, getState) => {
  const status = {
    connecting: false,
    connected: true,
    error: ""
  };
  dispatch(actions.setConnectionStatus(status));
};

const setError = error => (dispatch, getState) => {
  const status = {
    connecting: false,
    connected: false,
    error: error
  };
  dispatch(actions.setConnectionStatus(status));
};

const setEditMode = mode => dispatch => {
  dispatch(actions.setSelectedElement({ id: 0 }));
  dispatch(actions.setEditMode(mode));
};

// Links to actions
const loadElements = actions.loadElements;

export {
  selectElement,
  createNewElement,
  moveElement,
  resizeElement,
  updateElementProperty,
  deleteElement,
  loadElements,
  setEditMode,
  loadMockup,
  disconnect,
  setConnecting,
  setReconnecting,
  setConnected,
  setError
};
