import * as THREE from "three";
import { Shape, Cube, Cuboid, Plane } from "@/service/Shape";
import { baseline, radians } from "@/service/scene/helper/GeometryHelper";

/**
 * creates sceneobject based on given shaope
 * @param model: implementation of shape
 * @param position: global position
 * @param color: color of object material
 * @param clickable: object interacts on click
 * @param axis: rotation axis as normalized vector
 * @param angle: rotation angle in degree
 * @returns initialized scene object as mesh
 */
function createObject(
  model: Shape,
  position: THREE.Vector3,
  color = 0x199eb0,
  clickable = false,
  visible = true,
  axis?: THREE.Vector3,
  angle?: number
): THREE.Mesh {
  let object: THREE.Mesh = new THREE.Mesh();

  if (model instanceof Cube) object = createCube(model, color);
  if (model instanceof Cuboid) object = createCuboid(model, color);
  if (model instanceof Plane) object = createPlane(model, color);

  if (axis && angle) {
    object.rotateOnAxis(axis, radians(angle));
  }

  if (!(model.depth == 0 && axis?.x == 1)) {
    position = baseline(position, model.height);
  }

  object.userData.clickable = clickable;
  object.position.copy(position);
  object.visible = visible;
  return object;
}

/**
 * creates cube scene object
 * @param model: instance of cube
 * @param color: color of cube material
 * @returns initialized cube as mesh
 */
function createCube(model: Cube, color = 0x199eb0): THREE.Mesh {
  return new THREE.Mesh(
    new THREE.BoxGeometry(model.width, model.height, model.depth),
    new THREE.MeshStandardMaterial({ color: color })
  );
}

/**
 * creates cuboid scene object
 * @param model: instance of cuboid
 * @param color: color of cuboid material
 * @returns initialized cuboid as mesh
 */
function createCuboid(model: Cuboid, color = 0x199eb0): THREE.Mesh {
  return new THREE.Mesh(
    new THREE.BoxGeometry(model.width, model.height, model.depth),
    new THREE.MeshStandardMaterial({ color: color })
  );
}

/**
 * creates plane scene object
 * @param model: instance of plane
 * @param color: color of plane material
 * @returns initialized plane as mesh
 */
function createPlane(model: Plane, color = 0x199eb0): THREE.Mesh {
  return new THREE.Mesh(
    new THREE.PlaneGeometry(model.width, model.height),
    new THREE.MeshStandardMaterial({ color: color, side: THREE.DoubleSide })
  );
}

export function useObjectFactory() {
  return { createObject };
}
