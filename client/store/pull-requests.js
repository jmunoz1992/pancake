import axios from "axios";

/**
 * ACTION TYPES
 */
const GET_PULL_REQUESTS = "GET_PULL_REQUESTS";
const EDIT_PULL_REQUEST = "EDIT_PULL_REQUEST";
/**
 * ACTION CREATORS
 */
const load = pullRequests => ({ type: GET_PULL_REQUESTS, pullRequests });
const edit = pullRequest => ({ type: EDIT_PULL_REQUEST, pullRequest });

/**
 * REDUCER
 */
export default function reducer(state = [], action) {
  switch (action.type) {
    case GET_PULL_REQUESTS:
      return action.pullRequests;
    case EDIT_PULL_REQUEST:
      return action.pullRequest;
    default:
      return state;
  }
}

/**
 * THUNK CREATORS
 */
export const fetchPullRequests = () => dispatch =>
  axios
    .get("/api/pullRequests")
    .then(res => {
      return dispatch(load(res.data));
    })
    .catch(err => console.error("Fetching issues unsuccessful", err));

export const editPullRequest = pullRequest => dispatch =>
  axios
    .put("/api/pullRequests", pullRequest)
    .then(res => {
      return dispatch(edit(res.data));
    })
    .catch(err => console.error("Fetching issues unsuccessful", err));
