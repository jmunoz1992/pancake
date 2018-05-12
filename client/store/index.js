import { createStore, combineReducers, applyMiddleware } from "redux";
import createLogger from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import user from "./user";
import issues from "./issues";
import pullRequests from "./pull-requests";
import mockups from "./mockups";
import designer from "./designer";
import collaborators from "./collaborators";
import labels from "./labels";

const reducer = combineReducers({ user, issues, pullRequests, designer, mockups, collaborators, labels });
const middleware = composeWithDevTools(applyMiddleware(thunkMiddleware, createLogger({ collapsed: true })));
const store = createStore(reducer, middleware);

export default store;
export * from "./user";
export * from "./issues";
export * from "./pull-requests";
export * from "./designer";
export * from "./mockups";
export * from "./labels";
export * from "./collaborators";
