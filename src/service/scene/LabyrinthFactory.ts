import * as THREE from "three";
import { useTileFactory } from "@/service/scene/TileFactory";
import { usePlayerFactory } from "@/service/scene/PlayerFactory";

import { Labyrinth } from "@/service/labyrinth/Labyrinth";
import { Orientation, Tile } from "@/service/labyrinth/Tile";
import { MainPlayer, PartnerPlayer, Player, Role } from "@/service/game/Player";

import { vector } from "@/service/scene/helper/GeometryHelper";
import {
  colors,
  direction,
  settings,
} from "@/service/scene/helper/SceneConstants";

const { createTile } = useTileFactory();
const {
  requiresUpdate,
  updateMainPlayer,
  updatePartnerPlayer,
  resetPlayerData,
} = usePlayerFactory();

const storedTiles = new Map<number, THREE.Vector3>();
let labyrinthData: Labyrinth | undefined;

/**
 * gets map of all tiles of a Labyrinth
 * creates or updates them using TileFactory
 * adds Tiles to scene
 * @param labyrinth: labyrinth object
 * @param player: main player
 * @param scene: scene that contains labyrinth
 */
async function initializeLabyrinth(
  labyrinth: Labyrinth,
  player: MainPlayer,
  scene: THREE.Scene
) {
  labyrinthData = labyrinth;
  const position = vector(0, 0, 0);
  for (const [key, value] of labyrinth.tileMap) {
    const neighbors = getNeighbors(value, labyrinth.tileMap);
    const role = player.getRole();
    await placeTile(position, value, key, role, neighbors, scene);
  }
}

/**
 * updates tile
 * @param labyrinth: labyrinth object
 * @param scene: scene that contains labyrinth
 */
function updateLabyrinth(labyrinth: Labyrinth, scene: THREE.Scene) {
  if (labyrinthData == labyrinth) return;

  for (const [key, value] of labyrinth.tileMap) {
    const labyrinthObjects = value.objectsInRoom;
    const labyrinthDataObjects = labyrinthData?.tileMap.get(key);
    if (
      labyrinthDataObjects &&
      labyrinthDataObjects?.objectsInRoom.length > 0
    ) {
      const removedObjects = labyrinthDataObjects.objectsInRoom.filter(
        (item) => !labyrinthObjects.some((object) => object.id == item.id)
      );

      for (const object of removedObjects) {
        scene
          .getObjectByName(`${object.modelName.toLowerCase()}-${object.id}`)
          ?.clear();
      }
    }
  }
  labyrinthData = labyrinth;
}

function clearLabyrinth(scene: THREE.Scene) {
  labyrinthData = undefined;
  resetPlayerData();
  storedTiles.clear();
  scene.clear();
}
/**
 * updates player position of main or partner player
 * or initially creates partner player
 * @param player: main or partner player
 * @param scene: scene that contains player
 */
function updatePlayer(
  player: Player,
  labyrinth: Labyrinth,
  scene: THREE.Scene
) {
  if (!requiresUpdate(player)) return;
  console.log("Move player: " + player.getUsername());
  const tilePosition = storedTiles.get(player.getPosition());
  if (tilePosition) {
    if (player instanceof MainPlayer) {
      updateMainPlayer(player, tilePosition);
    }
    if (player instanceof PartnerPlayer) {
      updatePartnerPlayer(player, tilePosition, labyrinth, scene);
    }
  }
}

/**
 * adds tile of labyrinth to scene without recursion
 * @param position: starting position of first tile
 * @param tile: tile that should be placed in scene
 * @param tileKey: index of tile in labyrinth
 * @param role: role of user logged-in user
 * @param neighbors: contains relations to neighbors of the current tile
 * @param scene: origin scene
 */
async function placeTile(
  position: THREE.Vector3,
  tile: Tile,
  tileKey: number,
  role: Role | undefined,
  neighbors: Map<Orientation, Tile | undefined>,
  scene: THREE.Scene
) {
  for (const [key, value] of tile.tileRelationMap) {
    if (value && storedTiles.get(value)) {
      position = getNextPosition(storedTiles.get(value) as THREE.Vector3, key);
      break;
    }
  }
  // store placed tile with position to calculate position of next tiles
  storedTiles.set(tileKey, position);
  const color = getTileColor(tile);
  scene.add(createTile(tileKey, tile, position, role, neighbors, color));
}

/**
 * get color of tile according to role restrictions
 * @param tile: tile to get color for
 * @returns color of tile as hexadecimal number
 */
function getTileColor(tile: Tile) {
  //end tile color
  const endTile = labyrinthData?.tileMap.get(labyrinthData.endTileKey);
  if (endTile != undefined && endTile.tileId == tile.tileId) return colors.pink;
  //both players have access to this tile
  else if (tile.getRestrictions().length == 0) return colors.darkBrown;
  //only the designer has access to this tile
  else if (tile.isRestrictedFor(Role.HACKER)) return colors.beige;
  //only the hacker has access to this tile
  else if (tile.isRestrictedFor(Role.DESIGNER)) return colors.green;
  //default - this case shouldn't appear
  return colors.darkBrown;
}

/**
 * calculates position of next tile sibling based on orientation
 * @param position: last tile position
 * @param orientation: orientation where next tile should be placed
 * @returns position vector
 */
function getNextPosition(
  position: THREE.Vector3,
  orientation: Orientation
): THREE.Vector3 {
  const next = new THREE.Vector3().copy(position);
  switch (orientation) {
    case Orientation.NORTH:
      return next.addScaledVector(direction.north, -settings.tileSize);
    case Orientation.EAST:
      return next.addScaledVector(direction.east, -settings.tileSize);
    case Orientation.SOUTH:
      return next.addScaledVector(direction.south, -settings.tileSize);
    case Orientation.WEST:
      return next.addScaledVector(direction.west, -settings.tileSize);
  }
}

/**
 * convert tile relations of tile to actual tile objects
 * @param tile tile to get neighbors for
 * @param tileMap tilemap containing relation keys and tiles
 * @returns map of orientation and tiles
 */
function getNeighbors(tile: Tile, tileMap: Map<number, Tile>) {
  const neighbors = new Map<Orientation, Tile | undefined>();
  for (const [orientation, relationKey] of tile.getTileRelationMap()) {
    if (relationKey) neighbors.set(orientation, tileMap.get(relationKey));
    else neighbors.set(orientation, undefined);
  }
  return neighbors;
}

export function useLabyrinthFactory() {
  return {
    initializeLabyrinth,
    updateLabyrinth,
    updatePlayer,
    clearLabyrinth,
  };
}
