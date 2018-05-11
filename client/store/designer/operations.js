import * as actions from "./actions";
import { dispatchNetworkAction, connectToSession, disconnectFromSession } from "../../socket";

// Element Selection
const selectElements = elements => dispatch => {
  dispatch(actions.setSelectedElements(elements));
};

const addElementsToSelection = elements => dispatch => {
  dispatch(actions.addElementsToSelection(elements));
};

const removeElementFromSelection = elementToRemove => (dispatch, getState) => {
  const selection = getState().designer.selectedElements.filter(
    elememnt => elememnt.id !== elementToRemove.id
  );
  dispatch(actions.setSelectedElements(selection));
};

// Element manipulation
const getSelectedElementsFromIds = state =>
  state.designer.selectedElements.map(id => state.designer.elements.find(element => element.id === id));

const createNewElement = element => (dispatch, getState) => {
  element.id = "uninitialized";
  element.zIndex = getState().designer.elements.length;
  dispatchNetworkAction(actions.createElement(element));
};

const moveSelection = positionDelta => (dispatch, getState) => {
  const selection = getSelectedElementsFromIds(getState());
  selection.forEach(selectedElement => {
    selectedElement.top -= positionDelta.y;
    selectedElement.left -= positionDelta.x;
    dispatchNetworkAction(actions.updateElement(selectedElement));
  });
};

const updateElementProperty = (element, property, newValue) => (dispatch, getState) => {
  element[property] = newValue;
  dispatchNetworkAction(actions.updateElement(element));
};

const deleteElements = element => (dispatch, getState) => {
  const selection = getSelectedElementsFromIds(getState());
  selection.forEach(selectedElement => dispatchNetworkAction(actions.removeElement(selectedElement)));
  dispatch(selectElements([]));
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
  dispatch(actions.setSelectedElements());
  dispatch(actions.setEditMode(mode));
};

// Links to actions
const loadElements = actions.loadElements;

export {
  selectElements,
  addElementsToSelection,
  createNewElement,
  moveSelection,
  resizeElement,
  updateElementProperty,
  deleteElements,
  loadElements,
  setEditMode,
  loadMockup,
  disconnect,
  setConnecting,
  setReconnecting,
  setConnected,
  setError
};
