import axios from "axios";
import { combineReducers } from "redux";

const SET_SELECTED_MOCKUP = "designer/SET_SELECTED_MOCKUP";
const LOAD_MOCKUPS = "designer/LOAD_MOCKUPS";
const CREATE_MOCKUP = "designer/CREATE_MOCKUP";
const REMOVE_MOCKUP = "designer/REMOVE_MOCKUP";
const UPDATE_MOCKUP = "designer/UPDATE_MOCKUP";

const setSelectedMockup = mockup => ({ type: SET_SELECTED_MOCKUP, payload: mockup });
const createMockup = mockup => ({ type: CREATE_MOCKUP, payload: mockup });
const updateMockup = mockup => ({ type: UPDATE_MOCKUP, payload: mockup });
const removeMockup = mockup => ({ type: REMOVE_MOCKUP, payload: mockup });
const loadMockups = mockups => ({ type: LOAD_MOCKUPS, payload: mockups });

const selectedMockupReducer = (state = 0, action) => {
  switch (action.type) {
    case SET_SELECTED_MOCKUP:
      return action.payload.id;
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

export const fetchMockupList = () => dispatch =>
  axios.get("/api/project/mockups").then(response => dispatch(loadMockups(response.data)));

export const createNewMockup = name => dispatch =>
  axios.post("/api/project/mockups", { name }).then(response => dispatch(createMockup(response.data)));
