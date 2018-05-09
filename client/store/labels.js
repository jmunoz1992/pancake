import axios from "axios";
import history from "../history";
import { edit as editIssue } from "./issues";
/**
 * ACTION TYPES
 */
const GET_LABELS = "GET_LABELS";
const CREATE_LABEL = "CREATE_LABEL";
const ADD_LABEL = "ADD_LABEL";

/**
 * ACTION CREATORS
 */
const load = labels => ({ type: GET_LABELS, labels });
const create = label => ({ type: CREATE_LABEL, label });
const add = label => ({ type: ADD_LABEL, label });

/**
 * REDUCER
 */
export default function reducer(state = [], action) {
    switch (action.type) {
        case GET_LABELS:
            return action.labels;
        case CREATE_LABEL:
            return action.label;
        case ADD_LABEL:
            return [...state, action.label];
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

