import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { DoubleSide, TextureLoader } from "three";

import { Item } from "@/service/labyrinth/Item";
import { Orientation } from "@/service/labyrinth/Tile";
import { Arrow, Wall } from "@/service/labyrinth/FixedObject";
import { PartnerPlayer, Role } from "@/service/game/Player";

import { settings, factors } from "@/service/scene/helper/SceneConstants";
import { baseline, radians } from "@/service/scene/helper/GeometryHelper";

const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();

dracoLoader.setDecoderPath("/decoder/");
dracoLoader.preload();
gltfLoader.setDRACOLoader(dracoLoader);

const textureLoader = new TextureLoader();
const textures = new Map<string, THREE.Texture>();

const modelPath = (fileName: string) => {
  return `/gltf/${fileName}.gltf`;
};

const texturePath = (fileName: string) => {
  return require(`@/assets/img/textures/${fileName}-texture.png`);
};

const loadTexture = (fileName: string) => {
  return textureLoader.loadAsync(texturePath(fileName));
};

async function initTextures() {
  textures.set("end", await loadTexture("end"));
  textures.set("end-ceiling", await loadTexture("end-ceiling"));
  textures.set("end-floor", await loadTexture("end-floor"));
  textures.set("designer", await loadTexture("designer"));
  textures.set("designer-ceiling", await loadTexture("designer"));
  textures.set("hacker", await loadTexture("hacker"));
  textures.set("hacker-ceiling", await loadTexture("hacker-ceiling"));
  textures.set("bark", await loadTexture("bark"));
  textures.set("gras-floor", await loadTexture("gras-floor"));
  textures.set("restricted", await loadTexture("restricted"));
  textures.set("leaves-ceiling", await loadTexture("leaves-ceiling"));
}

initTextures();

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

  return gltfLoader.loadAsync(modelPath(model)).then((object) => {
    object.scene.position.copy(item.calcPositionInRoom().add(tilePosition));
    //get object size before rotation
    const box = new THREE.Box3().setFromObject(object.scene);
    box.getSize(size);
    if (size.x > settings.tileSize / 4) {
      factor = 1 / (size.x / factors.objectScaleFactor);
    } else if (size.y > settings.tileSize / 4) {
      factor = 1 / (size.y / factors.objectScaleFactor);
    }
    object.scene.scale.set(factor, factor, factor); //scale object to max size
    object.scene.rotateY(item.rotationY());
    object.scene.userData = item;
    object.scene.userData.clickable = true;
    object.scene.name = `item-${model}-${item.id}`;
    tileModel.add(object.scene);
  });
}

/**
 * creates plane representing tile's floor
 * contains tile position and userData
 * @param tilePosition: tile position
 * @param tileModel: parent tile to which object should be added after loading
 * @param color: color in hex-code
 * @param textureName: prefix of texture name
 */
async function createFloor(
  tilePosition: THREE.Vector3,
  tileModel: THREE.Group,
  color = 0x199eb0,
  textureName = "gras"
) {
  const texture = textures.get(`${textureName}-floor`) as THREE.Texture;
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
  object.rotateX(radians(90));
  object.name = "floor";
  tileModel.add(object);
}

/**
 * creates plane representing tile's ceiling
 * @param tilePosition: tile position
 * @param tileModel: parent tile to which object should be added after loading
 * @param color: color in hex-code
 * @param textureName: prefix of texture name
 */
async function createCeiling(
  tilePosition: THREE.Vector3,
  tileModel: THREE.Group,
  color = 0x199eb0,
  textureName = "leaves"
) {
  const texture = textures.get(`${textureName}-ceiling`) as THREE.Texture;
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

/**
 * creates textured plane representing tile's wall on given orientation
 * @param tilePosition: position of parent tile
 * @param tileModel: parent tile to which object should be added
 * @param orientation: orientation which wall should be placed and aligned on
 * @param color: wall color in hex-code
 * @param textureName: prefix of texture name
 */
async function createTexturedWall(
  tilePosition: THREE.Vector3,
  tileModel: THREE.Group,
  orientation: Orientation,
  color = 0x199eb0,
  textureName = "bark"
) {
  const wall = new Wall(orientation, tilePosition);
  const position = baseline(wall.position(), settings.tileSize);
  const texture = textures.get(textureName) as THREE.Texture;
  texture.minFilter = THREE.NearestFilter;
  const object = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(settings.tileSize, settings.tileSize),
    new THREE.MeshLambertMaterial({
      side: DoubleSide,
      map: texture,
      color: color,
      opacity: 0.6,
    })
  );
  object.position.copy(position);
  object.rotateY(wall.rotationY());
  tileModel.add(object);
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
  tileModel.add(object);
}

/**
 * creates optical restriction wall for user that isn't allowed to enter this area
 * @param tilePosition position of parent tile
 * @param tileModel contains TileGroup to add image of restriction
 * @param orientation orientation which restriction wall should be placed and aligned on
 * @param opacity: opacity as decimal of mesh
 * @param color: wall color in hex-code
 * @param textureName: prefix of texture name
 */
async function createRestrictiveWall(
  tilePosition: THREE.Vector3,
  tileModel: THREE.Group,
  orientation: Orientation,
  color = 0x199eb0,
  textureName = "restricted"
) {
  const wall = new Wall(orientation, tilePosition);
  const position = baseline(wall.position(), settings.tileSize);
  const texture = textures.get(textureName) as THREE.Texture;
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
  object.rotateY(wall.rotationY());
  tileModel.add(object);
}

/**
 * creates an arrow object that is aligned and directs to given orientation
 * @param tilePosition: position of parent tile
 * @param tileModel group on which arrow is placed
 * @param orientation: orientation arrow should direct to
 */
async function createArrow(
  tilePosition: THREE.Vector3,
  tileModel: THREE.Group,
  orientation: Orientation
) {
  const arrow = new Arrow(orientation, tilePosition);
  return gltfLoader.loadAsync(modelPath(arrow.modelName)).then((object) => {
    object.scene.position.copy(arrow.position());
    object.scene.userData.orientation = arrow.orientation;
    object.scene.userData.showInView = true;
    object.scene.rotateY(arrow.rotationY());
    object.scene.visible = false;
    object.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshLambertMaterial({
          color: arrow.color,
        });
      }
    });
    object.scene.name = arrow.modelName;
    tileModel.add(object.scene);
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
  return gltfLoader.loadAsync(modelPath(model)).then((object) => {
    object.scene.name = player.getUsername();
    object.scene.position.copy(tilePosition);
    object.scene.rotateY(90);
    const newPos = checkIntersect(
      object.scene,
      player.getPosition(),
      tilePosition,
      parent
    );
    object.scene.position.copy(newPos);
    parent.add(object.scene);
  });
}

/**
 * checks for intersections of partner model with items and updates position of partner accordingly
 * @param playerObject: model/Three.Group of PartnerPlayer
 * @param tileKey: tileKey of PartnerPlayers position
 * @param position: current vector position of player
 * @param scene: scene that contains all models + the partner
 * @returns new position of partnerPlayer
 */
function checkIntersect(
  playerObject: THREE.Object3D,
  tileKey: number,
  position: THREE.Vector3,
  scene: THREE.Scene | THREE.Group
): THREE.Vector3 {
  const tile = scene.getObjectByName(tileKey.toString()); //get current tile
  const items = tile?.children.filter((child) => child.name.includes("item")); //get all meshes in tile
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
