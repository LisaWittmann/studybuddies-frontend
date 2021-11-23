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

export class Cuboid implements Shape {
  height: number;
  width: number;
  depth: number;

  constructor(height: number, width: number, depth: number) {
    this.height = height;
    this.width = width;
    this.depth = depth;
  }
}

export class Plane implements Shape {
  height: number;
  width: number;
  depth: number;

  constructor(height: number, width: number) {
    this.height = height;
    this.width = width;
    this.depth = 0;
  }
}
