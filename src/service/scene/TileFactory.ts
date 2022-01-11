import * as THREE from "three";
import { useObjectFactory } from "@/service/scene/ObjectFactory";
import { Orientation, Tile } from "@/service/labyrinth/Tile";
import { Role } from "@/service/game/Player";
import { settings } from "@/service/scene/helper/SceneConstants";

/**
 * creates a group of objects representing a tile
 * @param tileKey: index of tile in the labyrinth
 * @param tile: representing tile data
 * @param tilePosition: position in scene
 * @param role: role of main player
 * @param neighbors: neighbor tiles with orientations
 * @param color: color of all walls
 * @returns initialized group of scene objects
 */
function createTile(
  tileKey: number,
  tile: Tile,
  tilePosition: THREE.Vector3,
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
  const texture = getTexture(tile);

  //LIGHT-----------------
  tileModel.add(createLight(tilePosition));

  //STATIC-ITEMS----------
  createCeiling(tilePosition, tileModel, color);
  createFloor(tilePosition, tileModel, tileKey, color);
  if (tileRestricted) {
    neighbors.forEach((neighbor, orientation) => {
      if (!neighbor) {
        createTexturedWall(
          tilePosition,
          tileModel,
          orientation,
          color,
          texture
        );
      }
    });
  } else {
    neighbors.forEach((neighbor, orientation) => {
      if (!neighbor) {
        createTexturedWall(
          tilePosition,
          tileModel,
          orientation,
          color,
          texture
        );
      } else if (!neighbor.isRestrictedFor(role)) {
        //arrow if there are no restrictions for the player in relation to the current tile
        createArrow(tilePosition, tileModel, orientation);
      } else {
        //transparent wall if restricted zone is starting in the current orientation
        createRestrictiveWall(tilePosition, tileModel, orientation, color);
      }
    });
  }

  //ITEMS-----------------
  for (const item of tile.objectsInRoom) {
    createItem(tilePosition, tileModel, item);
  }
  return tileModel;
}

function getTexture(tile: Tile) {
  if (tile.restrictions.length == 1) {
    if (tile.isRestrictedFor(Role.HACKER)) return "designer";
  }
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
