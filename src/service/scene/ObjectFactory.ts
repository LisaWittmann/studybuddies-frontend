import * as THREE from "three";
import type { Shape, Cube } from "@/service/Shape";
import { baseline } from "@/service/scene/helper/GeometryHelper";

function createObject(
  model: Shape,
  position: THREE.Vector3,
  color = 0xa9a9a9
): THREE.Mesh {
  const object = createCube(model, color);
  position = baseline(position, model.height);
  object.position.set(position.x, position.y, position.z);
  return object;
}

function createCube(model: Cube, color = 0x199eb0): THREE.Mesh {
  return new THREE.Mesh(
    new THREE.BoxGeometry(model.width, model.height, model.depth),
    new THREE.MeshStandardMaterial({ color })
  );
}

export function useObjectFactory() {
  return { createObject };
}
