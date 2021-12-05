import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";

import { Orientation } from "@/service/Tile";
import { Item } from "@/service/Item";
import { Arrow, Wall } from "@/service/FixedObject";

import { axis, settings } from "@/service/scene/helper/SceneConstants";
import { baseline, radians } from "@/service/scene/helper/GeometryHelper";

const objectLoader = new OBJLoader();
const materialLoader = new MTLLoader();

objectLoader.setPath("/models/");
materialLoader.setPath("/models/");

/**
 * creates item by loading its obj representation from models directory
 * @param item: item that should be loaded and added to scene
 * @param parent: group or scene object will be added to after loading
 */
async function createItem(item: Item, parent: THREE.Group | THREE.Scene) {
  const model = item.modelName.toLowerCase();
  await materialLoader.loadAsync(`${model}.mtl`).then((materials) => {
    materials.preload();
    objectLoader.setMaterials(materials);
    objectLoader.loadAsync(`${model}.obj`).then((object) => {
      object.position.copy(item.calcPositionInRoom());
      object.userData = item;
      object.userData.clickable = true;

      //BoundingBox------
      const box = new THREE.Box3().setFromObject(object);

      const boundingBoxHelper = new THREE.BoxHelper(object, 0xff0000);
      boundingBoxHelper.update();
      parent.add(object, boundingBoxHelper);
    });
  });
}

/**
 * creates plane representing tile's floor
 * @param position: tile position
 * @param color: floor color in hexa
 * @returns THREE.Mesh representation of floor
 */
function createFloor(position: THREE.Vector3, color = 0x199eb0) {
  const object = new THREE.Mesh(
    new THREE.PlaneGeometry(settings.tileSize, settings.tileSize),
    new THREE.MeshStandardMaterial({ color: color, side: THREE.DoubleSide })
  );
  object.position.copy(position);
  object.rotateOnAxis(axis.x, radians(90));
  return object;
}

/**
 * creates plane representing tile's ceiling
 * @param position: tile position
 * @param color: floor color in hexa
 * @returns THREE.Mesh representation of ceiling
 */
function createCeiling(position: THREE.Vector3, color = 0x199eb0) {
  const object = new THREE.Mesh(
    new THREE.PlaneGeometry(settings.tileSize, settings.tileSize),
    new THREE.MeshStandardMaterial({ color: color, side: THREE.DoubleSide })
  );
  object.position.set(position.x, position.y + settings.tileSize, position.z);
  object.rotateOnAxis(axis.x, radians(90));
  return object;
}

/**
 * creates plane representing tile's wall on given orientation
 * @param orientation: orientaion which wall should be placed and aligned on
 * @param tilePosition: position of parent tile
 * @param color: wall color in hexa
 * @returns THREE.Mesh representation of wall
 */
function createWall(
  orientation: Orientation,
  tilePosition: THREE.Vector3,
  color = 0x199eb0
): THREE.Mesh {
  const wall = new Wall(orientation, tilePosition);
  const position = baseline(wall.position(), settings.tileSize);
  const object = new THREE.Mesh(
    new THREE.PlaneGeometry(settings.tileSize, settings.tileSize),
    new THREE.MeshStandardMaterial({ color: color, side: THREE.DoubleSide })
  );
  object.position.copy(position);
  object.rotateOnAxis(axis.y, radians(wall.rotationY()));
  object.userData = wall;
  return object;
}

/**
 * creates an arrow object that is aligned and directs to given orientation
 * @param orientation: orientation arrow should directs to
 * @param tilePosition: position of parent tile
 * @returns: clickable arrow representation
 */
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
