import axios from "axios";
import { designerOperations } from "./index";
import { combineReducers } from "redux";

const SET_SELECTED_MOCKUP = "SET_SELECTED_MOCKUP";
const LOAD_MOCKUPS = "LOAD_MOCKUPS";
const CREATE_MOCKUP = "CREATE_MOCKUP";
const REMOVE_MOCKUP = "REMOVE_MOCKUP";
const UPDATE_MOCKUP = "UPDATE_MOCKUP";

const setSelectedMockup = mockupId => ({ type: SET_SELECTED_MOCKUP, payload: mockupId });
const createMockup = mockup => ({ type: CREATE_MOCKUP, payload: mockup });
const updateMockup = mockup => ({ type: UPDATE_MOCKUP, payload: mockup });
const removeMockup = mockup => ({ type: REMOVE_MOCKUP, payload: mockup });
const loadMockups = mockups => ({ type: LOAD_MOCKUPS, payload: mockups });

const selectedMockupReducer = (state = 0, action) => {
  switch (action.type) {
    case SET_SELECTED_MOCKUP:
      return action.payload;
    default:
      return state;
  }
};

const mockupsReducer = (state = [], action) => {
  switch (action.type) {
    case CREATE_MOCKUP:
      return [action.payload, ...state];
    case UPDATE_MOCKUP:
      return state.map(mockup => (action.payload.id === mockup.id ? action.payload : mockup));
    case REMOVE_MOCKUP:
      return state.filter(mockup => mockup.id !== action.payload.id);
    case LOAD_MOCKUPS:
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  mockupList: mockupsReducer,
  selectedMockup: selectedMockupReducer
});

export const createNewMockup = name => dispatch =>
  axios.post("/api/project/mockups", { name }).then(response => dispatch(createMockup(response.data)));

export const switchMockup = id => (dispatch, getState) => {
  if (getState().mockups.selectedMockup !== 0) dispatch(designerOperations.disconnect());
  dispatch(setSelectedMockup(id));
  dispatch(designerOperations.loadMockup());
};

export const fetchMockupList = () => dispatch =>
  axios.get("/api/project/mockups").then(response => {
    dispatch(loadMockups(response.data));
  });
