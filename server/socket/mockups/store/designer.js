// Simplified version of the Mockup Designer store on the front-end.  Since the back-end only cares
// about maintaining the shared state for all users, it doesn't need any action creators.
//
// Clients create actions and send them to the server.  The server dispatches those actions through
// its reducer, and then forwards them to all of the other clients so that other users can know
// what has changed.

const LOAD_ELEMENTS = "designer/LOAD_ELEMENTS";
const CREATE_ELEMENT = "designer/CREATE_ELEMENT";
const REMOVE_ELEMENT = "designer/REMOVE_ELEMENT";
const UPDATE_ELEMENT = "designer/UPDATE_ELEMENT";

module.exports = (state = [], action) => {
  switch (action.type) {
    case CREATE_ELEMENT:
      return [action.payload, ...state];
    case UPDATE_ELEMENT:
      return state.map(element => (action.payload.id === element.id ? action.payload : element));
    case REMOVE_ELEMENT:
      return state.filter(element => element.id !== action.payload.id);
    case LOAD_ELEMENTS:
      return action.payload;
    default:
      console.log("WARNING: Unknown action type received.", action);
      return state;
  }
};
