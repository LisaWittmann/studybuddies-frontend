export interface Shape {
  height: number;
  width: number;
  depth: number;
}

export class Cube implements Shape {
  height: number;
  width: number;
  depth: number;

  constructor(size: number) {
    this.height = size;
    this.width = size;
    this.depth = size;
  }
}
