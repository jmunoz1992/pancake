import { Textbox, Checkbox, Radio, Dropdown, Button } from "./forms";
import { Title, Header, Paragraph } from "./text";
import { Rectangle, Circle } from "./shapes";

const ElementLibrary = {
  Textbox: {
    element: Textbox,
    title: "Textbox",
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
  },
  Title: {
    element: Title,
    title: "Title",
    category: "Text",
    properties: { text: "Title Text" }
  },
  Header: {
    element: Header,
    title: "Header",
    category: "Text",
    properties: { text: "Header Text" }
  },
  Paragraph: {
    element: Paragraph,
    title: "Paragraph",
    category: "Text",
    properties: { text: "Paragraph Text" }
  },
  Rectangle: {
    element: Rectangle,
    title: "Rectangle",
    category: "Shapes",
    properties: {}
  },
  Circle: {
    element: Circle,
    title: "Circle",
    category: "Shapes",
    properties: {}
  }
};

export default ElementLibrary;
export * from "./forms";
