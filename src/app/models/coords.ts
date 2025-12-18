export class Coords {
  public x: number;
  public z: number;

  constructor(x: number = 0, z: number = 0) {
    this.x = x;
    this.z = z;
  }

  set(x: number, z: number) {
    this.x = x;
    this.z = z;
  }

  add(x: number, z: number) {
    this.x += x;
    this.z += z;
  }

  subtract(x: number, z: number) {
    this.x -= x;
    this.z -= z;
  }

  setWithCoords(coords: Coords) {
    this.x = coords.x;
    this.z = coords.z;
  }

  round() {
    this.x = Math.round(this.x);
    this.z = Math.round(this.z);
  }
}
