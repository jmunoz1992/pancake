// This folder uses the 're-ducks' pattern for organizing a Redux store.  Rather than keeping all
// action creators, thunk creators, constants, and reducers for a piece of state in a single file,
// each piece of state has its own folder with all of these things in individual files.
// This makes things more manageable when you have large or complex stores with lots of actions
// and thunks.  It's probably overkill for simpler stores.
// https://github.com/alexnm/re-ducks

import reducer from "./reducers";
import * as designerOperations from "./operations";

export { designerOperations };
export default reducer;
