import * as THREE from "three";
import { useTileFactory } from "@/service/scene/TileFactory";
import { usePlayerFactory } from "@/service/scene/PlayerFactory";

import { Orientation, Tile } from "@/service/labyrinth/Tile";
import { MainPlayer, PartnerPlayer, Player, Role } from "@/service/game/Player";

import { vector } from "@/service/scene/helper/GeometryHelper";
import {
  colors,
  direction,
  settings,
} from "@/service/scene/helper/SceneConstants";

const { createTile } = useTileFactory();
const { updateMainPlayer, updatePartnerPlayer } = usePlayerFactory();

const storedTiles = new Map<number, THREE.Vector3>();

/**
 * gets map of all tiles of a Labyrinth
 * creates or updates them using TileFactory
 * adds Tiles to scene
 * @param labyrinth: reactive labyrinth object
 * @param player: main player
 * @param scene: scene that contains labyrinth
 */
async function updateLabyrinth(
  labyrinth: any,
  player: MainPlayer,
  scene: THREE.Scene
) {
  const position = vector(0, 0, 0);
  for (const [key, value] of labyrinth.tileMap) {
    const tile = getTile(value.tileId, scene);
    if (!tile) {
      const neighbors = getNeighbors(value, labyrinth.tileMap);
      const role = player.getRole();
      placeTile(position, value, key, role, neighbors, scene);
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
  console.log("Move player: " + player);
  const tilePosition = getTilePosition(player.getPosition(), scene);
  if (tilePosition) {
    if (player instanceof MainPlayer) {
      updateMainPlayer(tilePosition);
    }
    if (player instanceof PartnerPlayer) {
      updatePartnerPlayer(player, tilePosition, scene);
    }
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
  if (tile.getRestrictions().length == 2) return colors.darkBrown;
  if (tile.isRestricedFor(Role.DESIGNER)) return colors.beige;
  if (tile.isRestricedFor(Role.HACKER)) return colors.green;
  return colors.grey;
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

/**
 * convert tile relations of tile to actual tile objects
 * @param tile tile to get neighbors for
 * @param tileMap tilemap containing relationkeys and tiles
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
    updateLabyrinth,
    updatePlayer,
  };
}
