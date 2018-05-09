import axios from "axios";
import history from "../history";

/**
 * ACTION TYPES
 */
const GET_LABELS = "GET_LABELS";
const CREATE_LABEL = "CREATE_LABEL";

/**
 * ACTION CREATORS
 */
const load = labels => ({ type: GET_LABELS, labels });
const create = label => ({ type: CREATE_LABEL, label });

/**
 * REDUCER
 */
export default function reducer(state = [], action) {
    switch (action.type) {
        case GET_LABELS:
            return action.labels;
        case CREATE_LABEL:
            return action.label;
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

