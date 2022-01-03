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
    console.log(tile);
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

async function updateTile() {
  console.log("updating tile");
}

/**
 * get tile 3D object by tileKey
 * @param tileKey: unique relation key of tile in scene
 * @param scene: scene that might contain tile
 * @returns 3D representation of tile with key
 */
function getTile(
  tileKey: number,
  scene: THREE.Scene
): THREE.Object3D | undefined {
  let tile = undefined;
  for (const child of scene.children) {
    if (child.userData.tileId == tileKey) tile = child;
  }
  return tile;
}

/**
 * get tile position by in scene by tile id
 * searches scene for tile's bottom plane that contains tile's position
 * @returns position in scene or undefined if tile is not in scene
 */
function getTilePosition(
  id: number,
  scene: THREE.Scene
): THREE.Vector3 | undefined {
  if (!id) return undefined;
  let position = undefined;
  scene.traverse((child) => {
    if (child.userData.tileKey == id) {
      position = child.position;
      console.log(child);
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

export function useLabyrinthFactory() {
  return {
    updateLabyrinth,
    updatePlayer,
  };
}
