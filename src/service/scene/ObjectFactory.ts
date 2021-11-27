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

async function createItem(item: Item, parent: THREE.Group | THREE.Scene) {
  const model = item.modelName.toLowerCase();
  await materialLoader.loadAsync(`${model}.mtl`).then((materials) => {
    materials.preload();
    objectLoader.setMaterials(materials);
    objectLoader.loadAsync(`${model}.obj`).then((object) => {
      object.position.copy(item.positionInRoom);
      object.userData = item;
      object.userData.clickable = true;
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
  tilePosition: THREE.Vector3
): THREE.Mesh {
  const arrow = new Arrow(orientation, tilePosition);
  const position = baseline(arrow.position(), 1);
  // testing arrow object
  const object = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 2),
    new THREE.MeshStandardMaterial({ color: 0xeaf4ea })
  );
  object.position.copy(position);
  object.rotateOnAxis(axis.y, radians(arrow.rotationY()));
  object.userData = arrow;
  object.visible = false;
  return object;
}

export function useObjectFactory() {
  return { createArrow, createWall, createCeiling, createFloor, createItem };
}
