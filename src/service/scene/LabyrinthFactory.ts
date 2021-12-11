import * as THREE from "three";
import { useTileFactory } from "@/service/scene/TileFactory";
import { usePlayerFactory } from "@/service/scene/PlayerFactory";

import { Orientation, Tile } from "@/service/labyrinth/Tile";

import { vector } from "@/service/scene/helper/GeometryHelper";
import { MainPlayer, PartnerPlayer, Player } from "@/service/game/Player";
import { direction, settings } from "@/service/scene/helper/SceneConstants";

const { createTile } = useTileFactory();
const { updateMainPlayer, updatePartnerPlayer } = usePlayerFactory();

const storedTiles = new Map<number, THREE.Vector3>();

/**
 * gets map of all tiles of a Labyrinth
 * creates or updates them using TileFactory
 * adds Tiles to scene
 * @param labyrinthState
 * @param scene
 */
async function updateLabyrinth(labyrinth: any, scene: THREE.Scene) {
  const position = vector(0, 0, 0);
  for (const [key, value] of labyrinth.tileMap) {
    const tile = getTile(value.tileId, scene);
    if (!tile) {
      placeTile(position, value, key, scene);
    } else if (value.objectsInRoom != tile.userData.objectsInRoom) {
      updateTile();
    }
  }
}

/**
 * updates player position of main or partner player
 * or initially creates partner player
 * @param player: main or partner player
 * @param scene: scene that contains player
 */
async function updatePlayer(player: Player, scene: THREE.Scene) {
  if (player instanceof MainPlayer) {
    const tilePosition = getTilePosition(player.getPosition(), scene);
    if (tilePosition) updateMainPlayer(tilePosition);
  }
  if (player instanceof PartnerPlayer) {
    const tilePosition = getTilePosition(player.getPosition(), scene);
    if (tilePosition) updatePartnerPlayer(player, tilePosition, scene);
  }
}

async function updateTile() {
  console.log("updating tile");
}

/**
 * adds tile of labyrinth to scene without recursion
 * @param position: starting position of first tile
 * @param tile: tile that should be placed in scene
 * @param scene: origin scene
 */
async function placeTile(
  position: THREE.Vector3,
  tile: Tile,
  tileKey: number,
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
  scene.add(createTile(tileKey, tile, position));
}

/**
 * get tile 3D object by tileId
 * @param tileId: unique id of tile in scene
 * @param scene: scene that might contain tile
 * @returns 3D representation of tile with id
 */
function getTile(
  tileId: number,
  scene: THREE.Scene
): THREE.Object3D | undefined {
  let tile = undefined;
  for (const child of scene.children) {
    if (child.userData.tileId == tileId) tile = child;
  }
  return tile;
}

/**
 * get all 3D tile objects in scene
 * @param scene: scene from which tiles should be extracted
 * @returns list of all tiles in scene
 */
function getTiles(scene: THREE.Scene): Array<THREE.Object3D> {
  return scene.children.filter((object) => {
    return object.userData.tileId;
  });
}

/**
 * get tile position by in scene by tile id
 * @returns position in scene or undefined if tile is not in scene
 */
function getTilePosition(
  id: number,
  scene: THREE.Scene
): THREE.Vector3 | undefined {
  let position = undefined;
  scene.traverse((child) => {
    if (child.userData.tileId == id) {
      position = child.position;
    }
  });
  return position;
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
 * get item representation in scene by item id
 * @param id: id of wanted item
 * @param scene: scene that might contain item
 * @returns representation of item or undefined
 */
function getItem(id: number, scene: THREE.Scene): THREE.Object3D | undefined {
  let item = undefined;
  scene.traverse((child) => {
    if (child.userData.id == id) item = child;
  });
  return item;
}

export function useLabyrinthFactory() {
  return {
    updateLabyrinth,
    updatePlayer,
  };
}
