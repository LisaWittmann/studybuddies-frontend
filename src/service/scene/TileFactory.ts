import * as THREE from "three";
import { useObjectFactory } from "@/service/scene/ObjectFactory";
import { Orientation, Tile } from "@/service/labyrinth/Tile";
import { Role } from "@/service/game/Player";
import { settings } from "@/service/scene/helper/SceneConstants";

/**
 * creates a group of objects representing a tile
 * @param tileKey: index of tile in the labyrinth
 * @param tile: representing tile data
 * @param position: position in scene
 * @param role: role of main player
 * @param neighbors: neighbor tiles with orientations
 * @param color: color of all walls
 * @returns initialized group of scene objects
 */
function createTile(
  tileKey: number,
  tile: Tile,
  position: THREE.Vector3,
  role: Role | undefined,
  neighbors: Map<Orientation, Tile | undefined>,
  color = 0xa9a9a9
): THREE.Group {
  const {
    createFloor,
    createCeiling,
    createArrow,
    createTexturedWall,
    createRestrictiveWall,
    createItem,
  } = useObjectFactory();
  const tileModel = new THREE.Group();
  tileModel.userData = tile;
  tileModel.userData.tileId = tileKey;
  tileModel.name = tileKey.toString();
  const tileRestricted = tile.isRestrictedFor(role);

  //LIGHT-----------------
  tileModel.add(createLight(position));

  //STATIC-ITEMS----------
  createCeiling(position, tileModel, color);
  createFloor(position, tileKey, tileModel, color);
  if (tileRestricted) {
    neighbors.forEach((neighbor, orientation) => {
      if (!neighbor) {
        createTexturedWall(orientation, position, tileModel, color);
      }
    });
  } else {
    neighbors.forEach((neighbor, orientation) => {
      if (!neighbor) {
        createTexturedWall(orientation, position, tileModel, color);
      } else if (!neighbor.isRestrictedFor(role)) {
        //arrow if there are no restrictions for the player in relation to the current tile
        createArrow(orientation, position, tileModel, role);
      } else {
        //transparent wall if restricted zone is starting in the current orientation
        createRestrictiveWall(tileModel, orientation, position, color);
      }
    });
  }

  //ITEMS-----------------
  for (const item of tile.objectsInRoom) {
    createItem(item, tileModel, position);
  }
  return tileModel;
}

/**
 * creates point light underneath top plane
 * @param position: center position of tile
 * @returns: point light
 */
function createLight(position: THREE.Vector3) {
  const light = new THREE.PointLight(0xffffff, 1, 50, 2);
  light.position.set(
    position.x,
    position.y + settings.tileSize / 2,
    position.z
  );
  return light;
}

export function useTileFactory() {
  return { createTile };
}
