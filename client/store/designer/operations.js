import * as actions from "./actions";
import { dispatchNetworkAction, connectToSession } from "../../socket";

// Element Selection
const selectElement = element => dispatch => {
  dispatch(actions.setSelectedElement(element));
};

// Element manipulation
const createNewElement = element => (dispatch, getState) => {
  console.log("creating element");
  element.id = getState().designerState.elements.length + 1;
  dispatchNetworkAction(actions.createElement(element));
};

const moveElement = (element, newPosition) => (dispatch, getState) => {
  element.top = newPosition.y;
  element.left = newPosition.x;
  dispatchNetworkAction(actions.updateElement(element));
};

const resizeElement = (element, newSize) => (dispatch, getState) => {
  element.width = newSize.width;
  element.height = newSize.height;
  dispatchNetworkAction(actions.updateElement(element));
};

// Network/Session
const loadMockup = mockupId => (dispatch, getState) => {
  dispatch(actions.loadElements([]));
  connectToSession(mockupId);
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

const loadElements = actions.loadElements;

export {
  selectElement,
  createNewElement,
  moveElement,
  resizeElement,
  loadElements,
  loadMockup,
  setConnecting,
  setReconnecting,
  setConnected,
  setError
};
