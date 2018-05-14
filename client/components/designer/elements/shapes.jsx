import React from "react";
import styled from "styled-components";
import { BaseElement } from "./base";

export class Rectangle extends BaseElement {
  constructor() {
    super();
    this.type = "Rectangle";
    this.height = 100;
    this.width = 200;
  }

  static MIN_WIDTH = 2;
  static MIN_HEIGHT = 2;
  static MAX_HEIGHT = 3000;
  static MAX_WIDTH = 3000;
  static COMPONENT = styled.div`
    height: 100%;
    width: 100%;
    background-color: white;
    border: 1px solid grey;
  `;
}

export class Circle extends BaseElement {
  constructor() {
    super();
    this.type = "Circle";
    this.height = 200;
    this.width = 200;
  }

  static MAX_HEIGHT = 1000;
  static MAX_WIDTH = 1000;
  static COMPONENT = styled.div`
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background-color: white;
    border: 1px solid grey;
  `;
}
