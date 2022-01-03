import { readonly } from "vue";
import { vector } from "@/service/scene/helper/GeometryHelper";

/**
 * scene settings
 */
export const settings = {
  tileSize: 20,
  cameraHeight: 8,
};

/**
 * scale factor for models
 */
export const factors = {
  objectScaleFactor: settings.tileSize / 4,
  partnerTranslateFactor: settings.tileSize / 4,
};

/**
 * axis vectors
 */
export const axis = {
  x: readonly(vector(1, 0, 0)),
  y: readonly(vector(0, 1, 0)),
  z: readonly(vector(0, 0, 1)),
};

/**
 * directional vectors of cardinal points
 */
export const direction = {
  north: readonly(vector(0, 0, -1)),
  east: readonly(vector(1, 0, 0)),
  south: readonly(vector(0, 0, 1)),
  west: readonly(vector(-1, 0, 0)),
};

/**
 * vertical positions of objects in room
 */
export const position = {
  floor: readonly(vector(0, 0, 0)),
  wall: readonly(vector(0, settings.tileSize / 2, 0)),
  ceiling: readonly(vector(0, settings.tileSize, 0)),
};

/**
 * styleguide colors
 */
export const colors = {
  lightGreen: 0x94a878,
  green: 0x5d702f,
  darkGreen: 0x39432f,
  beige: 0xe6bf5f,
  brown: 0x994814,
  darkBrow: 0x5641a,
  white: 0xf8f7f5,
  grey: 0xd7d9d5,
  black: 0x1a1e16,
};
