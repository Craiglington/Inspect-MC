export class Dimensions {
  public width: number;
  public height: number;
  constructor(width: number = 0, height: number = 0) {
    this.width = width;
    this.height = height;
  }

  set(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  add(width: number, height: number) {
    this.width += width;
    this.height += height;
  }

  subtract(width: number, height: number) {
    this.width -= width;
    this.height -= height;
  }

  setWithDimensions(dimensions: Dimensions) {
    this.width = dimensions.width;
    this.height = dimensions.height;
  }

  round() {
    this.width = Math.round(this.width);
    this.height = Math.round(this.height);
  }
}
