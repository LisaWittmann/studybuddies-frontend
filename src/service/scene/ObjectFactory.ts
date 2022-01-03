import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";

import { Item } from "@/service/labyrinth/Item";
import { Orientation } from "@/service/labyrinth/Tile";
import { Arrow, Wall } from "@/service/labyrinth/FixedObject";
import { PartnerPlayer, Role } from "@/service/game/Player";

import { settings } from "@/service/scene/helper/SceneConstants";
import { baseline, radians } from "@/service/scene/helper/GeometryHelper";
import { Scene, Vector3 } from "three";

const objectLoader = new OBJLoader();
const materialLoader = new MTLLoader();

objectLoader.setPath("/models/");
materialLoader.setPath("/models/");

/**
 * creates item by loading its obj representation from models directory
 * @param item: item that should be loaded and added to scene
 * @param parent: group or scene object will be added to after loading
 * @param position: position of parent object
 */
async function createItem(
  item: Item,
  parent: THREE.Group | THREE.Scene,
  position: THREE.Vector3
) {
  const model = item.modelName.toLowerCase();
  let factor = 1;
  const size = new Vector3();

  await materialLoader.loadAsync("materials.mtl").then((materials) => {
    materials.preload();
    objectLoader.setMaterials(materials);
    objectLoader.loadAsync(`${model}.obj`).then((object) => {
      object.position.copy(item.calcPositionInRoom().add(position));
      //get size before rotation
      const box = new THREE.Box3().setFromObject(object);
      box.getSize(size);
      if (size.x > settings.tileSize / 4) {
        factor = 1 / (size.x / (settings.tileSize / 4));
      } else if (size.y > settings.tileSize / 4) {
        factor = 1 / (size.y / (settings.tileSize / 4));
      }
      object.scale.set(factor, factor, factor);
      object.rotateY(item.rotationY());
      object.userData = item;
      object.userData.clickable = true;
      object.name = "item " + item.modelName;
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
  object.userData.tileKey = key;
  object.rotateX(radians(90));
  object.name = "floor";
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
  object.rotateX(radians(90));
  object.name = "ceiling";
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
  object.rotateY(wall.rotationY());
  object.userData = wall;
  object.name = "wall";
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
    object.rotateY(arrow.rotationY());
    object.visible = false;
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.color.setHex(arrow.color);
      }
    });
    object.name = "arrow";
    parent.add(object);
  });
}

/**
 * creates a new partner player representation
 * appearance of player is defined by it's role
 * @param player: player that should be represented
 * @param position: global position of player
 * @param parent: scene or group to which player should be added
 */
async function createPlayer(
  player: PartnerPlayer,
  position: THREE.Vector3,
  parent: THREE.Scene | THREE.Group
) {
  console.log("PLAYER", player);
  let model = "squirrel";
  const size = new Vector3();

  switch (player.getRole()) {
    case Role.DESIGNER:
      model += "-designer";
      break;
    case Role.HACKER:
      model += "-hacker";
      break;
  }
  await materialLoader.loadAsync(`${model}.mtl`).then((materials) => {
    materials.preload();
    objectLoader.setMaterials(materials);
    objectLoader.loadAsync(`${model}.obj`).then((object) => {
      object.userData.username = player.getUsername();
      object.name = player.getUsername();
      object.position.copy(position);
      object.rotateY(90);
      const newPos = checkIntersect(object, player, position, parent);
      object.position.copy(newPos);
      parent.add(object);
    });
  });
}

/**
 * checks for intersections of partner model with items and updates position of partner accordingly
 * @param player: data of PartnerPlayer
 * @param scene: scene that contains all models + the partner
 * @returns
 */
function checkIntersect(
  playerObject: THREE.Group,
  player: PartnerPlayer,
  position: THREE.Vector3,
  scene: THREE.Scene | THREE.Group
): Vector3 {
  //const playerObject = scene.getObjectByName(player.getUsername());
  const tile = scene.getObjectByName(player.getPosition().toString());

  //get all meshes in tile
  const items = tile?.children.filter((c) => c.name.includes("item"));

  //Player------
  const playerBox = new THREE.Box3().setFromObject(playerObject);
  //remove later-------
  const playerBoxHelper = new THREE.BoxHelper(playerObject, 0xff0000);
  scene.add(playerBoxHelper);

  //-------------------

  console.log("PLAYER POSITION:", position);
  //Items--------
  //Für jedes Item überprüfen, ober der Player intersects und dann player position in entprechende Richtung für Höhe der intersection verschieben
  //remove later-------
  items?.forEach((i) => {
    const itemBox = new THREE.Box3().setFromObject(i);
    console.log(itemBox.intersectsBox(playerBox));
    if (itemBox.intersectsBox(playerBox)) {
      console.log("intersection with ", i.name);
      console.log("ITEM BOX ", itemBox.min, itemBox.max);
      console.log("PLAYER BOX ", playerBox.min, playerBox.max);
      const intersectionBox = itemBox.intersect(playerBox);
      console.log("INTERSECTION BOX ", intersectionBox);

      let playerCorner;

      if (position.x > 0 && position.z < 0) {
        playerCorner = "NORTHEAST";
      } else if (position.x > 0 && position.z > 0) {
        playerCorner = "SOUTHEAST";
      } else if (position.x < 0 && position.z < 0) {
        playerCorner = "NORTHWEST";
      } else if (position.x < 0 && position.z > 0) {
        playerCorner = "SOUTHWEST";
      }

      switch (playerCorner) {
        case "NORTHEAST":
          if (
            intersectionBox.min.x == playerBox.min.x &&
            intersectionBox.max.x == itemBox.max.x
          ) {
            //intersection with item on west
            const x = intersectionBox.max.x - intersectionBox.min.x;
            position.setX(position.x + x);
            break;
          } else if (
            intersectionBox.min.z == playerBox.max.z &&
            intersectionBox.max.z == itemBox.min.z
          ) {
            const z = intersectionBox.max.z - intersectionBox.min.z;
            position.setZ(position.z - z);
          }
          break;
        case "SOUTHEAST":
          if (
            intersectionBox.min.x == playerBox.min.x &&
            intersectionBox.max.x == itemBox.max.x
          ) {
            //intersection with item on west
            const x = intersectionBox.max.x - intersectionBox.min.x;
            position.setX(position.x + x);
          } else if (
            intersectionBox.max.z == playerBox.max.z &&
            intersectionBox.min.z == itemBox.min.z
          ) {
            const z = intersectionBox.max.z - intersectionBox.min.z;
            position.setZ(position.z + z);
          }
          break;
        case "NORTHWEST":
          if (
            intersectionBox.min.x == playerBox.max.x &&
            intersectionBox.max.x == itemBox.min.x
          ) {
            //intersection with item on west
            const x = intersectionBox.max.x - intersectionBox.min.x;
            position.setX(position.x - x);
          } else if (
            intersectionBox.min.z == playerBox.max.z &&
            intersectionBox.max.z == itemBox.min.z
          ) {
            const z = intersectionBox.max.z - intersectionBox.min.z;
            position.setZ(position.z + z);
          }
          break;
        case "SOUTHWEST":
          if (
            intersectionBox.min.x == playerBox.max.x &&
            intersectionBox.max.x == itemBox.min.x
          ) {
            //intersection with item on west
            const x = intersectionBox.max.x - intersectionBox.min.x;
            position.setX(position.x - x);
          } else if (
            intersectionBox.max.z == playerBox.max.z &&
            intersectionBox.min.z == itemBox.min.z
          ) {
            const z = intersectionBox.max.z - intersectionBox.min.z;
            position.setZ(position.z + z);
          }
          break;
      }
    }
    const itemBoxHelper = new THREE.BoxHelper(i, 0x006800);
    scene.add(itemBoxHelper);
    itemBoxHelper.update();
    playerBoxHelper.update();
  });
  //-------------------

  return position;
}

export function useObjectFactory() {
  return {
    createArrow,
    createWall,
    createCeiling,
    createFloor,
    createItem,
    createPlayer,
    checkIntersect,
  };
}
