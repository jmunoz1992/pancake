import { createStore, combineReducers, applyMiddleware } from "redux";
import createLogger from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import user from "./user";
import issues from "./issues";
import collaborators from "./collaborators";
import { default as designerState } from "./designer";

const reducer = combineReducers({ user, issues, designerState, collaborators });
const middleware = composeWithDevTools(applyMiddleware(thunkMiddleware, createLogger({ collapsed: true })));
const store = createStore(reducer, middleware);

export default store;
export * from "./user";
export * from "./issues";
export * from "./designer";
export * from "./collaborators";
