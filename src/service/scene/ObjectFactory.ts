import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { DoubleSide, Texture, TextureLoader } from "three";

import { Item } from "@/service/labyrinth/Item";
import { Orientation } from "@/service/labyrinth/Tile";
import { Arrow, Wall } from "@/service/labyrinth/FixedObject";
import { PartnerPlayer, Role } from "@/service/game/Player";

import { settings, factors } from "@/service/scene/helper/SceneConstants";
import { baseline, radians } from "@/service/scene/helper/GeometryHelper";

/**
 * creates item by loading its obj representation from models directory
 * @param tilePosition: position of parent object
 * @param tileModel: group or scene object will be added to after loading
 * @param item: item that should be loaded and added to scene
 */
async function createItem(
  tilePosition: THREE.Vector3,
  tileModel: THREE.Group | THREE.Scene,
  item: Item
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
      object.position.copy(item.calcPositionInRoom().add(tilePosition));
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
      object.name = "item " + item.modelName + " id " + item.id;
      tileModel.add(object);
    });
  });
}

/**
 * creates plane representing tile's floor
 * contains tile position and userData
 * @param tilePosition: tile position
 * @param tileModel: parent tile to which object should be added after loading
 * @param tileKey: index of current tile
 * @param color: color in hex-code
 */
function createFloor(
  tilePosition: THREE.Vector3,
  tileModel: THREE.Group,
  tileKey: number,
  color = 0x199eb0
) {
  const textureLoader = new TextureLoader();
  textureLoader.load("/textures/gras-texture.png", (texture: Texture) => {
    texture.minFilter = THREE.NearestFilter;
    const object = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(settings.tileSize, settings.tileSize),
      new THREE.MeshLambertMaterial({
        side: DoubleSide,
        map: texture,
        color: color,
      })
    );
    object.position.copy(tilePosition);
    object.userData.tileKey = tileKey;
    object.rotateX(radians(90));
    object.name = "floor";
    tileModel.add(object);
  });
}

/**
 * creates plane representing tile's ceiling
 * @param tilePosition: tile position
 * @param tileModel: parent tile to which object should be added after loading
 * @param color: color in hex-code
 */
function createCeiling(
  tilePosition: THREE.Vector3,
  tileModel: THREE.Group,
  textureName = "leaves",
  color = 0x199eb0
) {
  const textureLoader = new TextureLoader();
  textureLoader.load(
    `/textures/${textureName}-ceiling-texture.png`,
    (texture: Texture) => {
      texture.minFilter = THREE.NearestFilter;
      const object = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(settings.tileSize, settings.tileSize),
        new THREE.MeshLambertMaterial({
          side: DoubleSide,
          map: texture,
          color: color,
        })
      );
      object.position.set(
        tilePosition.x,
        tilePosition.y + settings.tileSize,
        tilePosition.z
      );
      object.rotateX(radians(90));
      tileModel.add(object);
    }
  );
}

/**
 * creates textured plane representing tile's wall on given orientation
 * @param tilePosition: position of parent tile
 * @param tileModel: parent tile to which object should be added
 * @param orientation: orientation which wall should be placed and aligned on
 * @param color: wall color in hex-code
 */
function createTexturedWall(
  tilePosition: THREE.Vector3,
  tileModel: THREE.Group,
  orientation: Orientation,
  color = 0x199eb0,
  textureName = "bark"
) {
  const wall = new Wall(orientation, tilePosition);
  const position = baseline(wall.position(), settings.tileSize);
  const textureLoader = new TextureLoader();
  textureLoader.load(
    `/textures/${textureName}-texture.png`,
    (texture: Texture) => {
      texture.minFilter = THREE.NearestFilter;
      const object = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(settings.tileSize, settings.tileSize),
        new THREE.MeshLambertMaterial({
          side: DoubleSide,
          map: texture,
          color: color,
        })
      );
      object.position.copy(position);
      object.rotateY(wall.rotationY());
      object.userData = wall;
      object.name = "wall";
      tileModel.add(object);
    }
  );
}

/**
 * creates plane representing tile's wall on given orientation
 * @param tilePosition: position of parent tile
 * @param tileModel: parent tile to which object should be added after loading
 * @param orientation: orientation which wall should be placed and aligned on
 * @param color: wall color in hex-code
 * @param opacity: opacity as decimal of mesh
 */
function createWall(
  tilePosition: THREE.Vector3,
  tileModel: THREE.Group,
  orientation: Orientation,
  color = 0x199eb0,
  opacity = 1
) {
  const wall = new Wall(orientation, tilePosition);
  const position = baseline(wall.position(), settings.tileSize);
  const object = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(settings.tileSize, settings.tileSize),
    new THREE.MeshLambertMaterial({
      side: DoubleSide,
      color: color,
      transparent: opacity < 1,
      opacity: opacity,
    })
  );
  object.position.copy(position);
  object.rotateY(wall.rotationY());
  object.userData = wall;
  object.name = "wall";
  tileModel.add(object);
}

/**
 * creates optical restriction wall for user that isn't allowed to enter this area
 * @param tilePosition position of parent tile
 * @param tileModel contains TileGroup to add image of restriction
 * @param orientation orientation which restriction wall should be placed and aligned on
 * @param opacity: opacity as decimal of mesh
 */
function createRestrictiveWall(
  tilePosition: THREE.Vector3,
  tileModel: THREE.Group,
  orientation: Orientation,
  textureName = "restricted",
  color = 0x199eb0
) {
  const wall = new Wall(orientation, tilePosition);
  const position = baseline(wall.position(), settings.tileSize);
  const textureLoader = new TextureLoader();
  textureLoader.load(
    `/textures/${textureName}-texture.png`,
    function (texture: Texture) {
      texture.minFilter = THREE.NearestFilter;
      const object = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(settings.tileSize, settings.tileSize),
        new THREE.MeshLambertMaterial({
          side: DoubleSide,
          map: texture,
          transparent: true,
          opacity: 0.5,
          color: color,
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
 * @param tilePosition: position of parent tile
 * @param tileModel group on which arrow is placed
 * @param orientation: orientation arrow should direct to
 * @param role: Role of main player
 */
function createArrow(
  tilePosition: THREE.Vector3,
  tileModel: THREE.Group,
  orientation: Orientation
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
    tileModel.add(object);
  });
}

/**
 * creates a new partner player representation
 * appearance of player is defined by its role
 * @param player: player that should be represented
 * @param tilePosition: global position of player
 * @param parent: scene or group to which player should be added
 */
async function createPlayer(
  player: PartnerPlayer,
  tilePosition: THREE.Vector3,
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
      object.position.copy(tilePosition);
      object.rotateY(90);
      const newPos = checkIntersect(
        object,
        player.getPosition(),
        tilePosition,
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
    createTexturedWall,
    createRestrictiveWall,
    createCeiling,
    createFloor,
    createItem,
    createPlayer,
    checkIntersect,
  };
}
