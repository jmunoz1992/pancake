import { Textbox } from "./forms";

// Assigns each element to an object with a string name.  That way, we can look up the type/class
// of an element given it's string (which is important since we can't send classes over socket.io)
const ElementLibrary = {
  Textbox: Textbox
};

export default ElementLibrary;
export * from "./forms";
