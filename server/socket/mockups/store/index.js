const { createStore, combineReducers } = require("redux");
const designer = require("./designer");
const { Mockup, MockupElement } = require("../../../db/models");

async function createStoreForMockup(mockupId) {
  const mockup = await Mockup.findById(mockupId);
  if (!mockup) throw new Error(`Mockup '${mockupId}' isn't valid.`);
  const mockupElements = await MockupElement.findAll({ where: { mockupId: mockupId } });
  const initialState = mockupElements.map(element => JSON.parse(element.data));
  console.log(`Restored ${initialState.length} mockup elements from database.`);
  const store = createStore(combineReducers({ designer }));
  store.serialize = debounce(serializeStore, 3000);
  store.dispatch({ type: "designer/LOAD_ELEMENTS", payload: initialState });
  return store;
}

async function serializeStore(store, mockupId) {
  console.log("Serializing");
  const elements = store.getState().designer;
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

// UTILITY
//https://gist.github.com/steveosoule/8c98a41d20bb77ae62f7
const debounce = function(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this,
      args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};
