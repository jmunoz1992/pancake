import axios from "axios";
import history from "../history";

/**
 * ACTION TYPES
 */
const GET_ISSUES = "GET_ISSUES";
const REMOVE_ISSUE = "REMOVE_ISSUE";
const EDIT_ISSUE = "EDIT_ISSUE";
const CREATE_ISSUE = "CREATE_ISSUE";

/**
 * ACTION CREATORS
 */
const loadIssues = issues => ({ type: GET_ISSUES, issues });
const removeIssue = issueId => ({ type: REMOVE_ISSUE, id: issueId });
const editIssue = issue => ({ type: EDIT_ISSUE, issue });
const createIssue = issue => ({ type: CREATE_ISSUE, issue });

/**
 * REDUCER
 */
export default function reducer(state = [], action) {
  switch (action.type) {
    case GET_ISSUES:
      return action.issues;

    case CREATE_ISSUE:
      return [action.issue, ...state];

    case REMOVE_ISSUE:
      return state.filter(issue => issue.id !== action.id);

    case EDIT_ISSUE:
      return state.map(issue => (action.issue.id === issue.id ? action.issue : issue));

    default:
      return state;
  }
}

/**
 * THUNK CREATORS
 */
export const fetchIssues = () => dispatch =>
  axios
    .get("/api/issues")
    .then(res => dispatch(loadIssues(res.data)))
    .catch(err => console.error("Fetching issues unsuccessful", err));
