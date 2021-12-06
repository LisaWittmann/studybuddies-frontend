import * as THREE from "three";
import { useTileFactory } from "@/service/scene/TileFactory";

import { Orientation, Tile } from "@/service/labyrinth/Tile";

import { vector } from "@/service/scene/helper/GeometryHelper";
import { direction, settings } from "@/service/scene/helper/SceneConstants";

const { createTile } = useTileFactory();

const storedTiles = new Map<number, THREE.Vector3>();

/**
 * gets map of all tiles of a Labyrinth
 * creates them using TileFactory
 * adds Tiles to scene
 * @param labyrinthState
 * @param scene
 */
async function updateLabyrinth(labyrinth: any, scene: THREE.Scene) {
  const position = vector(0, 0, 0);
  for (const [, value] of labyrinth.tileMap) {
    const tile = getTile(value.tileId, scene);
    if (!tile) {
      placeTile(position, value, scene);
    } else if (value.objectsInRoom != tile.userData.objectsInRoom) {
      updateTile(tile, value);
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
  scene: THREE.Scene
) {
  for (const [key, value] of tile.tileRelationMap) {
    if (value && storedTiles.get(value)) {
      position = getNextPosition(storedTiles.get(value) as THREE.Vector3, key);
      break;
    }
  }
  // store placed tile with position to calculate position of next tiles
  storedTiles.set(tile.getId(), position);
  scene.add(createTile(tile, position));
}

async function updateTile(tile: THREE.Object3D, model: Tile) {
  console.log("updating tile");
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
  for (const child of scene.children) {
    if (child.userData.tileId == tileId) return child;
  }
  return undefined;
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

export function useLabyrinthFactory() {
  return {
    updateLabyrinth,
    getTilePosition,
  };
}
