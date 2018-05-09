import axios from "axios";
import history from "../history";

/**
 * ACTION TYPES
 */
const GET_ISSUES = "GET_ISSUES";
const REMOVE_ISSUE = "REMOVE_ISSUE";
const EDIT_ISSUE = "EDIT_ISSUE";
const CREATE_ISSUE = "CREATE_ISSUE";
const ADD_LABEL_TO_ISSUE = "ADD_LABEL_TO_ISSUE";

/**
 * ACTION CREATORS
 */
const load = issues => ({ type: GET_ISSUES, issues });
const remove = issueId => ({ type: REMOVE_ISSUE, id: issueId });
export const edit = issue => ({ type: EDIT_ISSUE, issue });
const create = issue => ({ type: CREATE_ISSUE, issue });
const addLabelToIssue = (issueId, labels) => ({ type: ADD_LABEL_TO_ISSUE, issueId, labels });

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

    case ADD_LABEL_TO_ISSUE:
      return state.map(issue => {
        if (action.issueId === issue.id) return { ...issue, labels: action.labels };
        return issue;
      });

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
    .then(res => dispatch(load(res.data)))
    .catch(err => console.error("Fetching issues unsuccessful", err));

export const editIssue = (number, issue) => dispatch =>
  axios
    .put(`/api/issues/${number}`, issue)
    .then(res => dispatch(edit(res.data)))
    .catch(err => console.error(`Updating issue ${number} unsuccessful`, err));

export const addAssignee = (number, assignees) => dispatch =>
  axios
    .post(`/api/issues/${number}/assignees`, assignees)
    .then(res => dispatch(edit(res.data)))
    .catch(err => console.error(`Adding assignee to issue ${number} unsuccessful`, err));

export const removeAssignee = (number, assignees) => dispatch =>
  axios
    .put(`/api/issues/${number}/assignees`, assignees)
    .then(res => dispatch(edit(res.data)))
    .catch(err => console.error(`Removing assignee from issue ${number} unsuccessful`, err));

export const addLabel = (number, labels, issueId) => dispatch => {
  console.log("labels", labels);
  axios
    .post(`/api/issues/${number}/labels`, labels)
    .then(res => {
      console.log("RES.DATA", res.data);
      dispatch(addLabelToIssue(issueId, res.data));
    })
    .catch(err => console.error("Adding label unsuccessful", err));
};
