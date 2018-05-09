import axios from "axios";

/**
 * ACTION TYPES
 */
const GET_ISSUES = "GET_ISSUES";
const REMOVE_ISSUE = "REMOVE_ISSUE";
const EDIT_ISSUE = "EDIT_ISSUE";
const CREATE_ISSUE = "CREATE_ISSUE";
const ADD_LABEL_TO_ISSUE = "ADD_LABEL_TO_ISSUE";
const REMOVE_LABEL_FROM_ISSUE = "REMOVE_LABEL_FROM_ISSUE";

/**
 * ACTION CREATORS
 */
const load = issues => ({ type: GET_ISSUES, issues });
const edit = issue => ({ type: EDIT_ISSUE, issue });
const addLabelToIssue = (issueId, labels) => ({ type: ADD_LABEL_TO_ISSUE, issueId, labels });
const removeLabelFromIssue = (issueId, newLabels) => ({ type: REMOVE_LABEL_FROM_ISSUE, issueId, newLabels });

/**
 * REDUCER
 */
export default function reducer(state = [], action) {
  switch (action.type) {
    case GET_ISSUES:
      return action.issues;

    case EDIT_ISSUE:
      console.log("ACTION", action);
      return state.map(issue => {
        if (action.issue.id === issue.id) return action.issue;
        return issue;
      });

    case ADD_LABEL_TO_ISSUE:
      return state.map(issue => {
        if (action.issueId === issue.id) return { ...issue, labels: action.labels };
        return issue;
      });

    case REMOVE_LABEL_FROM_ISSUE:
      return state.map(issue => {
        if (action.issueId === issue.id) return { ...issue, labels: action.newLabels };
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

export const editIssue = issue => dispatch =>
  axios
    .put(`/api/issues/${issue.number}`, issue)
    .then(res => dispatch(edit(res.data)))
    .catch(err => console.error(`Updating issue ${issue.number} unsuccessful`, err));

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

export const addLabel = (number, labels, issueId) => dispatch =>
  axios
    .post(`/api/issues/${number}/labels`, labels)
    .then(res => dispatch(addLabelToIssue(issueId, res.data)))
    .catch(err => console.error("Adding label unsuccessful", err));

export const removeLabel = (number, label, issueId) => dispatch => {
  axios
    .delete(`/api/issues/${number}/labels/${label.name}`)
    .then(res => dispatch(removeLabelFromIssue(issueId, res.data)))
    .catch(err => console.error("Removing label unsuccessful", err));
};

