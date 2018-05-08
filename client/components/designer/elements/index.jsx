import { Textbox, TextboxWithLabel, Checkbox, Radio, Dropdown, Button } from "./forms";

const ElementLibrary = {
  Textbox: {
    element: Textbox,
    title: "Textbox",
    category: "Forms",
    properties: { placeholder: "Placeholder" }
  },
  TextboxWithLabel: {
    element: TextboxWithLabel,
    title: "Textbox with Label",
    category: "Forms",
    properties: { placeholder: "Placeholder", label: "Textbox" }
  },
  Checkbox: {
    element: Checkbox,
    title: "Checkbox",
    category: "Forms",
    properties: { label: "Checkbox" }
  },
  Radio: {
    element: Radio,
    title: "Radio Button",
    category: "Forms",
    properties: { label: "Radio Button" }
  },
  Dropdown: {
    element: Dropdown,
    title: "Dropdown",
    category: "Forms",
    properties: { placeholder: "Dropdown" }
  },
  Button: {
    element: Button,
    title: "Button",
    category: "Forms",
    properties: { text: "Button" }
  }
};

export default ElementLibrary;
export * from "./forms";
