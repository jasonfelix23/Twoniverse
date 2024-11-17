export class Boundary {
  position: { x: number; y: number };
  width: number;
  height: number;

  constructor(x: number, y: number, tileSize: number) {
    this.position = { x: x, y: y };
    this.width = tileSize;
    this.height = tileSize;
  }
}
