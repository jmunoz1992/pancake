import { Textbox, Checkbox, Radio, Dropdown, Button } from "./forms";
import { Title, Header, Paragraph } from "./text";
import { Rectangle, Circle, Image } from "./shapes";

const ElementLibrary = {
  Textbox: {
    element: Textbox,
    title: "Textbox",
    category: "Forms",
    properties: {
      placeholder: { name: "Placeholder Text", type: "string" },
      label: { name: "Label Text", type: "string", default: "Textbox" }
    }
  },
  Checkbox: {
    element: Checkbox,
    title: "Checkbox",
    category: "Forms",
    properties: { label: { name: "Label Text", type: "string", default: "Checkbox" } }
  },
  Radio: {
    element: Radio,
    title: "Radio Button",
    category: "Forms",
    properties: { label: { name: "Label Text", type: "string", default: "Radio Button" } }
  },
  Dropdown: {
    element: Dropdown,
    title: "Dropdown",
    category: "Forms",
    properties: { placeholder: { name: "Placeholder Text", type: "string", default: "Dropdown" } }
  },
  Button: {
    element: Button,
    title: "Button",
    category: "Forms",
    properties: { text: { name: "Button Text", type: "string", default: "Button" } }
  },
  Title: {
    element: Title,
    title: "Title",
    category: "Text",
    properties: { text: { name: "Title Text", type: "string" } }
  },
  Header: {
    element: Header,
    title: "Header",
    category: "Text",
    properties: { text: { name: "Header Text", type: "string" } }
  },
  Paragraph: {
    element: Paragraph,
    title: "Paragraph",
    category: "Text",
    properties: { text: { name: "Paragraph Text", type: "longstring" } }
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
  },
  Image: {
    element: Image,
    title: "Image",
    category: "Shapes",
    properties: { imageUrl: { name: "Image URL", type: "string", default: "/pancake-500.png" } }
  }
};

export default ElementLibrary;
export * from "./forms";
