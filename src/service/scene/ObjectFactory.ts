import * as THREE from "three";
import { Shape, Cube, Cuboid, Plane } from "@/service/Shape";
import { baseline, radians } from "@/service/scene/helper/GeometryHelper";

function createObject(
  model: Shape,
  position: THREE.Vector3,
  color = 0x199eb0,
  clickable = false,
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
  return object;
}

function createCube(model: Cube, color = 0x199eb0): THREE.Mesh {
  return new THREE.Mesh(
    new THREE.BoxGeometry(model.width, model.height, model.depth),
    new THREE.MeshStandardMaterial({ color })
  );
}

function createCuboid(model: Cuboid, color = 0x199eb0): THREE.Mesh {
  return new THREE.Mesh(
    new THREE.BoxGeometry(model.width, model.height, model.depth),
    new THREE.MeshStandardMaterial({ color: color })
  );
}

function createPlane(model: Plane, color = 0x199eb0): THREE.Mesh {
  return new THREE.Mesh(
    new THREE.PlaneGeometry(model.width, model.height),
    new THREE.MeshStandardMaterial({ color: color, side: THREE.DoubleSide })
  );
}

export function useObjectFactory() {
  return { createObject };
}
