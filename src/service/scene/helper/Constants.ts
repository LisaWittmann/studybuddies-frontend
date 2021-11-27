import { readonly } from "vue";
import { vector } from "@/service/scene/helper/GeometryHelper";

export const tileSize = 20;

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
