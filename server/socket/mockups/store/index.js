const { createStore, combineReducers, applyMiddleware } = require("redux");
const createLogger = require("redux-logger");
const designerState = require("./designer");

function createMockupStore(mockup) {
  // TODO: Initialize the store with a mockup loaded from the disk.
  const logger = createLogger({ logger: console });
  const reducer = combineReducers({ designerState });
  const store = createStore(reducer, applyMiddleware(logger));
  return store;
}

module.exports = createMockupStore;
