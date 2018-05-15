import axios from "axios";
/**
 * ACTION TYPES
 */
const GET_LABELS = "GET_LABELS";

/**
 * ACTION CREATORS
 */
const load = labels => ({ type: GET_LABELS, labels });

/**
 * REDUCER
 */
export default function reducer(state = [], action) {
  switch (action.type) {
    case GET_LABELS:
      return action.labels;
    default:
      return state;
  }
}

/**
 * THUNK CREATORS
 */
export const fetchLabels = () => dispatch =>
  axios
    .get("/api/issues/labels")
    .then(res => dispatch(load(res.data)))
    .catch(err => console.error("Fetching labels unsuccessful", err));

export const createNewLabel = (name, color) => dispatch =>
  axios
    .post("/api/issues/labels", { name, color })
    .then(res => dispatch(fetchLabels()))
    .catch(err => console.error("Label could not be created.", err));
