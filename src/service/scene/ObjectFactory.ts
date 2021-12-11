import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";

import { Item } from "@/service/labyrinth/Item";
import { Orientation, Tile } from "@/service/labyrinth/Tile";
import { Arrow, Wall } from "@/service/labyrinth/FixedObject";

import { axis, settings } from "@/service/scene/helper/SceneConstants";
import { baseline, radians } from "@/service/scene/helper/GeometryHelper";
import { PartnerPlayer } from "../game/Player";

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
      //rotation already calculated to radians
      object.rotateY(item.rotationY());
      object.userData = item;
      object.userData.clickable = true;
      parent.add(object);
    });
  });
}

/**
 * creates plane representing tile's floor
 * contains tile position and userData
 * @param position: tile position
 * @param color: floor color in hexa
 * @returns THREE.Mesh representation of floor
 */
function createFloor(position: THREE.Vector3, color = 0x199eb0, key: number) {
  const object = new THREE.Mesh(
    new THREE.PlaneGeometry(settings.tileSize, settings.tileSize),
    new THREE.MeshStandardMaterial({ color: color, side: THREE.DoubleSide })
  );
  object.position.copy(position);
  object.userData.tileId = key;
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
  tilePosition: THREE.Vector3,
  parent: THREE.Group
) {
  const arrow = new Arrow(orientation, tilePosition);
  objectLoader.loadAsync("arrow.obj").then((object) => {
    object.position.copy(arrow.position());
    object.userData = arrow;
    object.userData.clickable = true;
    object.rotateOnAxis(axis.y, radians(arrow.rotationY()));
    object.visible = false;
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.color.setHex(arrow.color);
      }
    });
    parent.add(object);
  });
}

function createPlayer(
  model: PartnerPlayer,
  position: THREE.Vector3
): THREE.Object3D | undefined {
  console.log("creating partner player");
  return undefined;
}

export function useObjectFactory() {
  return {
    createArrow,
    createWall,
    createCeiling,
    createFloor,
    createItem,
    createPlayer,
  };
}
