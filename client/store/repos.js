import axios from "axios";

/**
 * ACTION TYPES
 */
const GET_REPO_INFO = "GET_REPO_INFO";
/**
 * ACTION CREATORS
 */
const loadRepoInfo = repoInfo => ({ type: GET_REPO_INFO, repoInfo });

/**
 * REDUCER
 */
export default function reducer(state = {}, action) {
  switch (action.type) {
    case GET_REPO_INFO:
      return action.repoInfo;
    default:
      return state;
  }
}

/**
 * THUNK CREATORS
 */
export const getRepoInfo = () => dispatch => {
  axios
    .get("/api/repos")
    .then(res => {
      return dispatch(loadRepoInfo(res.data[0]));
    })
    .catch(err => console.error("Fetching repo info unsuccessful", err));
};
