import * as actions from "./actions";

const selectElement = element => dispatch => {
  dispatch(actions.setSelectedElement(element));
};

const createNewElement = element => (dispatch, getState) => {
  element.id = getState().designerState.elements.length + 1;
  dispatch(actions.createElement(element));
};

const moveElement = (element, newPosition) => (dispatch, getState) => {
  element.top = newPosition.y;
  element.left = newPosition.x;
  dispatch(actions.updateElement(element));
};

const resizeElement = (element, newSize) => (dispatch, getState) => {
  element.width = newSize.width;
  element.height = newSize.height;
  dispatch(actions.updateElement(element));
};

export { selectElement, createNewElement, moveElement, resizeElement };
