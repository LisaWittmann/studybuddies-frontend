import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";

import { Item } from "@/service/labyrinth/Item";
import { Orientation } from "@/service/labyrinth/Tile";
import { Arrow, Wall } from "@/service/labyrinth/FixedObject";
import { PartnerPlayer, Role } from "@/service/game/Player";

import { settings, factors } from "@/service/scene/helper/SceneConstants";
import { baseline, radians } from "@/service/scene/helper/GeometryHelper";
import { DoubleSide, Texture, TextureLoader } from "three";

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
  const size = new THREE.Vector3();

  const objLoader = new OBJLoader();
  const mtlLoader = new MTLLoader();

  await mtlLoader.loadAsync(`/materials/${model}.mtl`).then((materials) => {
    materials.preload();
    objLoader.setMaterials(materials);
    objLoader.loadAsync(`/models/${model}.obj`).then((object) => {
      object.position.copy(item.calcPositionInRoom().add(position));
      //get object size before rotation
      const box = new THREE.Box3().setFromObject(object);
      box.getSize(size);
      if (size.x > settings.tileSize / 4) {
        factor = 1 / (size.x / factors.objectScaleFactor);
      } else if (size.y > settings.tileSize / 4) {
        factor = 1 / (size.y / factors.objectScaleFactor);
      }
      object.scale.set(factor, factor, factor); //scale object to max size
      object.rotateY(item.rotationY());
      object.userData = item;
      object.userData.clickable = true;
      object.name = `${model}-${item.id}`;
      parent.add(object);
    });
  });
}

/**
 * creates plane representing tile's floor
 * contains tile position and userData
 * @param position: tile position
 * @param key: index of current tile
 * @param color: floor color in hex-code
 * @returns THREE.Mesh representation of floor
 */
function createFloor(position: THREE.Vector3, key: number, color = 0x199eb0) {
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
 * @param color: floor color in hex-code
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
 * @param orientation: orientation which wall should be placed and aligned on
 * @param tilePosition: position of parent tile
 * @param color: wall color in hex-code
 * @param opacity: opacity as decimal of mesh
 * @returns THREE.Mesh representation of wall
 */
function createWall(
  orientation: Orientation,
  tilePosition: THREE.Vector3,
  color = 0x199eb0,
  opacity = 1
): THREE.Mesh {
  const wall = new Wall(orientation, tilePosition);
  const position = baseline(wall.position(), settings.tileSize);
  const object = new THREE.Mesh(
    new THREE.PlaneGeometry(settings.tileSize, settings.tileSize),
    new THREE.MeshStandardMaterial({
      color: color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: opacity,
    })
  );
  object.position.copy(position);
  object.rotateY(wall.rotationY());
  object.userData = wall;
  object.name = `wall-${orientation.toString().toLowerCase()}`;
  return object;
}

/**
 * creates optical restriction wall for user that isn't allowed to enter this area
 * @param tileModel contains TileGroup to add image of restriction
 * @param orientation orientation which restriction wall should be placed and aligned on
 * @param tilePosition position of parent tile
 */
function createRestrictiveWall(
  tileModel: THREE.Group,
  orientation: Orientation,
  tilePosition: THREE.Vector3
) {
  const wall = new Wall(orientation, tilePosition);
  const position = baseline(wall.position(), settings.tileSize);
  const textureLoader = new TextureLoader();
  textureLoader.load(
    "/textures/RestrictedTexture.png",
    function (texture: Texture) {
      texture.minFilter = THREE.NearestFilter;
      const object = new THREE.Mesh(
        new THREE.PlaneGeometry(settings.tileSize, settings.tileSize),
        new THREE.MeshStandardMaterial({
          side: DoubleSide,
          map: texture,
          transparent: true,
        })
      );
      object.position.copy(position);
      object.userData = wall;
      object.rotateY(wall.rotationY());
      tileModel.add(object);
    }
  );
}

/**
 * creates an arrow object that is aligned and directs to given orientation
 * @param orientation: orientation arrow should direct to
 * @param tilePosition: position of parent tile
 * @param parent group on which arrow is placed
 * @returns: clickable arrow representation
 */
function createArrow(
  orientation: Orientation,
  tilePosition: THREE.Vector3,
  parent: THREE.Group
) {
  const arrow = new Arrow(orientation, tilePosition);
  const objLoader = new OBJLoader();
  objLoader.loadAsync("/models/arrow.obj").then((object) => {
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
 * appearance of player is defined by its role
 * @param player: player that should be represented
 * @param position: global position of player
 * @param parent: scene or group to which player should be added
 */
async function createPlayer(
  player: PartnerPlayer,
  position: THREE.Vector3,
  parent: THREE.Scene | THREE.Group
) {
  let model = "squirrel";
  switch (player.getRole()) {
    case Role.DESIGNER:
      model += "-designer";
      break;
    case Role.HACKER:
      model += "-hacker";
      break;
  }
  const objLoader = new OBJLoader();
  const mtlLoader = new MTLLoader();
  await mtlLoader.loadAsync(`/materials/${model}.mtl`).then((materials) => {
    materials.preload();
    objLoader.setMaterials(materials);
    objLoader.loadAsync(`/models/${model}.obj`).then((object) => {
      object.userData.username = player.getUsername();
      object.name = player.getUsername();
      object.position.copy(position);
      object.rotateY(90);
      const newPos = checkIntersect(
        object,
        player.getPosition(),
        position,
        parent
      );
      object.position.copy(newPos);
      parent.add(object);
    });
  });
}

/**
 * checks for intersections of partner model with items and updates position of partner accordingly
 * @param playerObject: model/Three.Group of PartnerPlayer
 * @param player: data of PartnerPlayer
 * @param position: current vector position of player
 * @param scene: scene that contains all models + the partner
 * @returns
 */
function checkIntersect(
  playerObject: THREE.Object3D,
  tileKey: number,
  position: THREE.Vector3,
  scene: THREE.Scene | THREE.Group
): THREE.Vector3 {
  const tile = scene.getObjectByName(tileKey.toString()); //get current tile
  const items = tile?.children.filter((c) => c.name.includes("item")); //get all meshes in tile
  const playerBox = new THREE.Box3().setFromObject(playerObject); //creates bounding box of player

  items?.forEach((i) => {
    const itemBox = new THREE.Box3().setFromObject(i); //creates bounding box for each item
    if (itemBox.intersectsBox(playerBox)) {
      let playerCorner;
      const intersectionBox = itemBox.intersect(playerBox);

      //get in which corner player is positioned
      if (position.x > 0 && position.z < 0) {
        playerCorner = "NORTHEAST";
      } else if (position.x > 0 && position.z > 0) {
        playerCorner = "SOUTHEAST";
      } else if (position.x < 0 && position.z < 0) {
        playerCorner = "NORTHWEST";
      } else if (position.x < 0 && position.z > 0) {
        playerCorner = "SOUTHWEST";
      }

      //check for intersections in corner
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
            //intersection with item on south
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
            //intersection with item on north
            const z = intersectionBox.max.z - intersectionBox.min.z;
            position.setZ(position.z + z);
          }
          break;
        case "NORTHWEST":
          if (
            intersectionBox.min.x == playerBox.max.x &&
            intersectionBox.max.x == itemBox.min.x
          ) {
            //intersection with item on east
            const x = intersectionBox.max.x - intersectionBox.min.x;
            position.setX(position.x - x);
          } else if (
            intersectionBox.min.z == playerBox.max.z &&
            intersectionBox.max.z == itemBox.min.z
          ) {
            //intersection with item on south
            const z = intersectionBox.max.z - intersectionBox.min.z;
            position.setZ(position.z + z);
          }
          break;
        case "SOUTHWEST":
          if (
            intersectionBox.min.x == playerBox.max.x &&
            intersectionBox.max.x == itemBox.min.x
          ) {
            //intersection with item on east
            const x = intersectionBox.max.x - intersectionBox.min.x;
            position.setX(position.x - x);
          } else if (
            intersectionBox.max.z == playerBox.max.z &&
            intersectionBox.min.z == itemBox.min.z
          ) {
            //intersection with item on north
            const z = intersectionBox.max.z - intersectionBox.min.z;
            position.setZ(position.z + z);
          }
          break;
      }
    }
  });
  return position;
}

export function useObjectFactory() {
  return {
    createArrow,
    createWall,
    createRestrictiveWall,
    createCeiling,
    createFloor,
    createItem,
    createPlayer,
    checkIntersect,
  };
}
