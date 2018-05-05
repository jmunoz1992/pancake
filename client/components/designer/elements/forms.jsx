import React from "react";
import styled from "styled-components";
import { BaseElement } from "./base";

/*
  TEXTBOX
*/
export const TextboxComponent = props => {
  return (
    <div>
      <span>Textbox Label</span>
      <input placeholder="Textbox" />
    </div>
  );
};

export class Textbox extends BaseElement {
  constructor() {
    super();
    this.placeholder = "Placeholder";
    this.height = 45;
    this.width = 150;
  }

  static COMPONENT = TextboxComponent;
  static MAX_HEIGHT = 45;
  static MAX_WIDTH = 1000;
}

// export const CheckboxComponent = props => {
//   return (
//     <div>
//       <input type="checkbox" />
//       <label>Checkbox Label</label>
//     </div>
//   );
// };

// export class Checkbox extends BaseElement {
//   constructor() {
//     super();
//     this.placeholder = "Placeholder";
//   }

//   static COMPONENT = TextboxComponent;
//   static MAX_HEIGHT = 40;
//   static MAX_WIDTH = 1000;
// }

// export const Button = props => {
//   return (
//     <div>
//       <input type="button" value="Button" />
//     </div>
//   );
// };
