import * as actions from "./actions";
import { default as socket } from "../../socket";

const selectElement = element => dispatch => {
  dispatch(actions.setSelectedElement(element));
};

const createNewElement = element => (dispatch, getState) => {
  console.log("creating element");
  element.id = getState().designerState.elements.length + 1;
  const action = actions.createElement(element);
  socket.emit("dispatch-action", action);
  // dispatch(action);
};

const moveElement = (element, newPosition) => (dispatch, getState) => {
  element.top = newPosition.y;
  element.left = newPosition.x;
  const action = actions.updateElement(element);
  socket.emit("dispatch-action", action);
  // dispatch(action);
};

const resizeElement = (element, newSize) => (dispatch, getState) => {
  element.width = newSize.width;
  element.height = newSize.height;
  const action = actions.updateElement(element);
  socket.emit("dispatch-action", action);
  // dispatch(action);
};

const loadElements = actions.loadElements;

export { selectElement, createNewElement, moveElement, resizeElement, loadElements };
