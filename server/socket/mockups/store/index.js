const { createStore, combineReducers } = require("redux");
const designerState = require("./designer");
const { Mockup, MockupElement } = require("../../../db/models");

async function createStoreForMockup(mockupId) {
  const mockup = await Mockup.findById(mockupId);
  if (!mockup) throw new Error(`Mockup '${mockupId}' isn't valid.`);
  const mockupElements = await MockupElement.findAll({ where: { mockupId: mockupId } });
  const initialState = mockupElements.map(element => JSON.parse(element.data));
  console.log(`Restored ${initialState.length} mockup elements from database.`);
  const store = createStore(combineReducers({ designerState }));
  store.dispatch({ type: "designer/LOAD_ELEMENTS", payload: initialState });
  return store;
}

async function serializeStore(store, mockupId) {
  const elements = store.getState().designerState;
  await MockupElement.destroy({ where: { mockupId } });
  for (const element of elements) {
    let model = await MockupElement.findOrCreate({ where: { id: element.id } });
    model = model[0];
    model.setMockup(mockupId, { save: false });
    model.data = JSON.stringify(element);
    await model.save();
  }
}

module.exports = { createStoreForMockup, serializeStore };
