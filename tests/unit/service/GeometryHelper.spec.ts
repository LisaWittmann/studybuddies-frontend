import { radians, vector, baseline } from "@/service/scene/helper/GeometryHelper";
import { Vector3 } from "three";

test("radians func with 0 degree returns 0", () => {
  expect(radians(0)).toBe(0);
});

test("radians func with 90 degrees returns ~ 1.57079", () => {
  expect(radians(90)).toBeCloseTo(1.57079);
});

test("vector creates new THREE vector", () => {
  expect(vector(0, 0, 0)).toEqual(new Vector3(0, 0, 0));
});

test("baseline shifts y value based on given height", () => {
  const vec = vector(0, 0, 0);
  const height = 10;
  const halfHeight = height / 2;
  expect(baseline(vec, height)).toEqual(vector(0, halfHeight, 0));
});
