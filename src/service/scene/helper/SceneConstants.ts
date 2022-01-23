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
 * styleguide colors
 */
export const colors = readonly({
  brown: 0x995c2e,
  beige: 0x997f3f,
  green: 0x678f42,
  pink: 0xd874d8,
  grey: 0xd7d9d5,
});
