import * as THREE from "three";
import { useTileFactory } from "@/service/scene/TileFactory";
import { Labyrinth } from "@/service/Labyrinth";
import { Orientation, Tile } from "@/service/Tile";
import { vector } from "./helper/GeometryHelper";

const { createTile } = useTileFactory();
//const storedTiles: THREE.Vector3[] = [];
const storedTiles = new Map<number, THREE.Vector3>();
const tileSize = 20;

/**
 * gets Map of all Tiles of a Labyrinth
 * creates them using TileFactory
 * adds Tiles to scene
 * @param labyrinthState
 * @param scene
 */
function createLabyrinth(labyrinth: Labyrinth, scene: THREE.Scene) {
  const position = vector(0, 0, 0);
  for (const [key, value] of labyrinth.tileMap) {
    placeTile(position, value, scene);
  }
}

/**
 * adds tile of labyrinth to scene
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
  storedTiles.set(tile.getId(), position);
  scene.add(createTile(tile, tileSize, tileSize, position));
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
  switch (orientation) {
    case Orientation.NORTH:
      return vector(position.x, position.y, position.z + tileSize / 2);
    case Orientation.EAST:
      return vector(position.x - tileSize / 2, position.y, position.z);
    case Orientation.SOUTH:
      return vector(position.x, position.y, position.z - tileSize / 2);
    case Orientation.WEST:
      return vector(position.x + tileSize / 2, position.y, position.z);
  }
}

export function useLabyrinthFactory() {
  return {
    createLabyrinth,
  };
}
