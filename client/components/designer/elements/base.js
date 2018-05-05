export class BaseElement {
  constructor() {
    this.id = 0;
    this.name = "Element";
    this.zIndex = 0;
    this.top = 0;
    this.left = 0;
    this.height = 0;
    this.width = 0;
  }

  static COMPONENT = null;
  static MIN_HEIGHT = 15;
  static MIN_WIDTH = 15;
  static MAX_HEIGHT = 5000;
  static MAX_WIDTH = 5000;
}
