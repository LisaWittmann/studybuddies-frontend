/**
 * interface for scene objects
 */
export interface Shape {
  height: number;
  width: number;
  depth: number;
}

/**
 * implements shape interface
 * represents geometry of a cube
 */
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

/**
 * implements shape interface
 * represents geometry of a cuboid
 */
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

/**
 * implements shape interface
 * represents geometry of a plane
 */
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
