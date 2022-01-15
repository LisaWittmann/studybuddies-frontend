import { Vector3 } from "three";

/**
 * coverts angle in degree to angle in radiant
 * @param angle: angle in degree
 * @returns: angle in radiant
 */
export const radians = (angle: number): number => {
  return (angle * Math.PI) / 180;
};

/**
 * helper for object center positioning
 * @param position; 3 dimensional coordinates
 * @param height: height of the object
 */
export const baseline = (position: Vector3, height: number): Vector3 => {
  return new Vector3(position.x, position.y + height / 2, position.z);
};

/**
 * short vector initialization
 */
export const vector = (x: number, y: number, z: number): Vector3 => {
  return new Vector3(x, y, z);
};

export const equals = (vec1: Vector3, vec2: Vector3): boolean => {
  vec1.normalize();
  vec2.normalize();
  return vec1.x == vec2.x && vec1.y == vec2.y && vec1.z == vec2.z;
};
