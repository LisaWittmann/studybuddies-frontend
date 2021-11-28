import { readonly } from "vue";
import { vector } from "@/service/scene/helper/GeometryHelper";

export const tileSize = 20;
export const cameraHeight = 8;

export const axis = {
  x: readonly(vector(1, 0, 0)),
  y: readonly(vector(0, 1, 0)),
  z: readonly(vector(0, 0, 1)),
};

export const direction = {
  north: readonly(vector(0, 0, -1)),
  east: readonly(vector(1, 0, 0)),
  south: readonly(vector(0, 0, 1)),
  west: readonly(vector(-1, 0, 0)),
};

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
