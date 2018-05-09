import axios from "axios";

/**
 * ACTION TYPES
 */
const GET_COLLABORATORS = "GET_COLLABORATORS";

/**
 * ACTION CREATORS
 */
const loadCollaborators = collaborators => ({ type: GET_COLLABORATORS, collaborators });

/**
 * REDUCER
 */
export default function reducer(state = [], action) {
    switch (action.type) {
        case GET_COLLABORATORS:
            return action.collaborators;
        default:
            return state;
    }
}

/**
 * THUNK CREATORS
 */
export const fetchCollaborators = () => dispatch =>
    axios
        .get("/api/collaborators")
        .then(res => dispatch(loadCollaborators(res.data)))
        .catch(err => console.error("Fetching issues unsuccessful", err));
