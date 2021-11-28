import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";

import { Arrow, Wall, Orientation, Item } from "@/service/Tile";
import { axis, tileSize } from "@/service/scene/helper/Constants";
import { baseline, radians } from "@/service/scene/helper/GeometryHelper";

const objectLoader = new OBJLoader();
const materialLoader = new MTLLoader();

objectLoader.setPath("/models/");
materialLoader.setPath("/models/");

async function createItem(model: Item | Arrow, parent: THREE.Group | THREE.Scene, position: THREE.Vector3) {
  const path = model.modelName.toLowerCase();
  await materialLoader.loadAsync(`${path}.mtl`).then((materials) => {
    materials.preload();
    objectLoader.setMaterials(materials);
    objectLoader.loadAsync(`${path}.obj`).then((object) => {
      object.position.copy(position);
      object.userData = model;
      object.userData.clickable = true;
      if (model instanceof Arrow) {
        object.rotateOnAxis(axis.y, radians(model.rotationY()));
        object.visible = false;
      }

      const debug = new THREE.Box3().setFromObject(object);
      parent.add(object);
    });
  });
}

function createFloor(position: THREE.Vector3, color = 0x199eb0) {
  const object = new THREE.Mesh(
    new THREE.PlaneGeometry(tileSize, tileSize),
    new THREE.MeshStandardMaterial({ color: color, side: THREE.DoubleSide })
  );
  object.position.copy(position);
  object.rotateOnAxis(axis.x, radians(90));
  return object;
}

function createCeiling(position: THREE.Vector3, color = 0x199eb0) {
  const object = new THREE.Mesh(
    new THREE.PlaneGeometry(tileSize, tileSize),
    new THREE.MeshStandardMaterial({ color: color, side: THREE.DoubleSide })
  );
  object.position.set(position.x, position.y + tileSize, position.z);
  object.rotateOnAxis(axis.x, radians(90));
  return object;
}

function createWall(
  orientation: Orientation,
  tilePosition: THREE.Vector3,
  color = 0x199eb0
): THREE.Mesh {
  const wall = new Wall(orientation, tilePosition);
  const position = baseline(wall.position(), tileSize);
  const object = new THREE.Mesh(
    new THREE.PlaneGeometry(tileSize, tileSize),
    new THREE.MeshStandardMaterial({ color: color, side: THREE.DoubleSide })
  );
  object.position.copy(position);
  object.rotateOnAxis(axis.y, radians(wall.rotationY()));
  object.userData = wall;
  return object;
}

function createArrow(
  orientation: Orientation,
  tilePosition: THREE.Vector3,
  parent: THREE.Group
) {
  const arrow = new Arrow(orientation, tilePosition);
  createItem(arrow, parent, arrow.position());
}

export function useObjectFactory() {
  return { createArrow, createWall, createCeiling, createFloor, createItem };
}
