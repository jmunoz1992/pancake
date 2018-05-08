import React from "react";
import {
  Form,
  Input,
  Button as SemanticButton,
  Dropdown as SemanticDropdown,
  Checkbox as SemanticCheckbox
} from "semantic-ui-react";
import styled from "styled-components";
import { BaseElement } from "./base";

export class Textbox extends BaseElement {
  constructor() {
    super();
    this.type = "Textbox";
    this.height = 65;
    this.width = 200;
    this.placeholder = "";
    this.label = "";
  }

  static MAX_HEIGHT = 100;
  static MAX_WIDTH = 1000;
  static COMPONENT = props => (
    <Form>
      <Form.Field>
        <label>{props.element.label}</label>
        <Input placeholder={props.element.placeholder} />
      </Form.Field>
    </Form>
  );
}

export class Checkbox extends BaseElement {
  constructor() {
    super();
    this.type = "Checkbox";
    this.height = 25;
    this.width = 150;
    this.label = "";
  }

  static MAX_HEIGHT = 25;
  static MAX_WIDTH = 1000;
  static COMPONENT = props => <SemanticCheckbox label={props.element.label} />;
}

export class Radio extends BaseElement {
  constructor() {
    super();
    this.type = "Radio";
    this.height = 25;
    this.width = 150;
    this.label = "";
  }

  static MAX_HEIGHT = 25;
  static MAX_WIDTH = 1000;
  static COMPONENT = props => <SemanticCheckbox radio label={props.element.label} />;
}

export class Dropdown extends BaseElement {
  constructor() {
    super();
    this.type = "Dropdown";
    this.height = 38;
    this.width = 150;
    this.text = "";
  }

  static MIN_HEIGHT = 38;
  static MAX_HEIGHT = 38;
  static MAX_WIDTH = 1000;
  static COMPONENT = props => (
    <SemanticDropdown placeholder={props.element.placeholder} fluid selection options={[]} />
  );
}
export class Button extends BaseElement {
  constructor() {
    super();
    this.type = "Button";
    this.height = 40;
    this.width = 150;
    this.placeholder = "";
  }

  static MAX_HEIGHT = 100;
  static MAX_WIDTH = 1000;
  static COMPONENT = props => (
    <SemanticButton fluid style={{ height: "100%" }}>
      {props.element.text}
    </SemanticButton>
  );
}
