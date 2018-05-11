import axios from "axios";

/**
 * ACTION TYPES
 */
const GET_PULL_REQUESTS = "GET_PULL_REQUESTS";

/**
 * ACTION CREATORS
 */
const load = pullRequests => ({ type: GET_PULL_REQUESTS, pullRequests });

/**
 * REDUCER
 */
export default function reducer(state = [], action) {
  switch (action.type) {
    case GET_PULL_REQUESTS:
      return action.pullRequests;

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
      console.log("res data in fetch pull request ", res.data);
      return dispatch(load(res.data));
    })
    .catch(err => console.error("Fetching issues unsuccessful", err));
