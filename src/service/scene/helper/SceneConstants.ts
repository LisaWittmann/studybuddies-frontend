import { readonly } from "vue";
import { radians, vector } from "@/service/scene/helper/GeometryHelper";
import { Orientation } from "@/service/labyrinth/Tile";

/**
 * scene settings
 */
export const settings = readonly({
  tileSize: 20,
  cameraHeight: 4,
});

/**
 * scale factor for models
 */
export const factors = readonly({
  objectScaleFactor: settings.tileSize / 4,
  partnerTranslateFactor: settings.tileSize / 4,
});

/**
 * axis vectors
 */
export const axis = readonly({
  x: readonly(vector(1, 0, 0)),
  y: readonly(vector(0, 1, 0)),
  z: readonly(vector(0, 0, 1)),
});

/**
 * directional vectors of cardinal points
 */
export const direction = readonly({
  north: readonly(vector(0, 0, -1)),
  east: readonly(vector(1, 0, 0)),
  south: readonly(vector(0, 0, 1)),
  west: readonly(vector(-1, 0, 0)),
});

/**
 * directional vectors mapped to orientation
 */
export const directionMap = readonly(
  new Map([
    [Orientation.NORTH, direction.north],
    [Orientation.EAST, direction.east],
    [Orientation.SOUTH, direction.south],
    [Orientation.WEST, direction.west],
  ])
);

/**
 * rotation angle in radians mapped to orientation
 * if object is positioned in orientation
 */
export const rotations = readonly(
  new Map([
    [Orientation.NORTH, radians(0)],
    [Orientation.EAST, radians(270)],
    [Orientation.SOUTH, radians(180)],
    [Orientation.WEST, radians(90)],
  ])
);

/**
 * rotation angle in radians mapped to orientation
 * if object should face the given orientation
 */
export const movementRotations = readonly(
  new Map([
    [Orientation.NORTH, radians(180)],
    [Orientation.EAST, radians(270)],
    [Orientation.SOUTH, radians(0)],
    [Orientation.WEST, radians(90)],
  ])
);

/**
 * vertical positions of objects in room
 */
export const position = readonly({
  floor: readonly(vector(0, 0, 0)),
  wall: readonly(vector(0, settings.tileSize / 2, 0)),
  ceiling: readonly(vector(0, settings.tileSize, 0)),
});

/**
 * styleguide colors
 */
export const colors = readonly({
  lightGreen: 0x94a878,
  green: 0x5d702f,
  darkGreen: 0x39432f,
  beige: 0xe6bf5f,
  brown: 0x994814,
  darkBrown: 0x56341a,
  white: 0xf8f7f5,
  grey: 0xd7d9d5,
  black: 0x1a1e16,
});
