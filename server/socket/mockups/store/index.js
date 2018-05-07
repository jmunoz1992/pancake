const { createStore, combineReducers } = require("redux");
const designerState = require("./designer");
const { Mockup, MockupElement } = require("../../../db/models");

async function createStoreForMockup(mockupId) {
  const mockup = await Mockup.findById(mockupId);
  if (!mockup) throw new Error(`Mockup '${mockupId}' isn't valid.`);
  const mockupElements = await MockupElement.find({ where: { mockupId: mockupId } });
  console.log("Finished query", mockupElements && mockupElements.length);

  const reducer = combineReducers({ designerState });
  const store = createStore(reducer);
  return store;
}

async function serializeStore(mockup) {}

module.exports = createStoreForMockup;
