import * as THREE from "three";
import { useTileFactory } from "@/service/scene/TileFactory";
import { Labyrinth } from "@/service/Labyrith";
import { Orientation, Tile } from "@/service/Tile";
import { vector } from "./helper/GeometryHelper";

const { createTile } = useTileFactory();
const tileSize = 20;

/**
 * gets Map of all Tiles of a Labyrinth
 * creates them using TileFactory
 * adds Tiles to scene
 * @param labyrinthState
 * @param scene
 */
function createLabyrinth(labyrinth: Labyrinth, scene: THREE.Scene) {
  // add fist tile on position 0, 0, 0
  const tile = labyrinth.tileMap.get(1) as Tile;
  const position = vector(0, 0, 0);
  const firstTile = createTile(tile, tileSize, tileSize, position);
  console.log(firstTile.position);
  scene.add(firstTile);
  createTilesRecursive(tile, position, scene);
}

/**
 * calculates position of next tile sibling based on orientation
 * @param position: last tile position
 * @param orientation: orientation where next tile should be placed
 * @returns position vector
 */
function calculatePosition(
  position: THREE.Vector3,
  orientation: Orientation
): THREE.Vector3 {
  switch (orientation) {
    case Orientation.NORTH:
      return vector(position.x, position.y, position.z - tileSize / 2);
    case Orientation.EAST:
      return vector(position.x + tileSize / 2, position.y, position.z);
    case Orientation.SOUTH:
      return vector(position.x, position.y, position.z + tileSize / 2);
    case Orientation.WEST:
      return vector(position.x - tileSize / 2, position.y, position.z);
  }
}

async function createTilesRecursive(
  tile: Tile,
  position: THREE.Vector3,
  scene: THREE.Scene
) {
  for (const [key, value] of tile.tileRelationMap) {
    if (value) {
      position = calculatePosition(position, key);
      console.log(position);
      const nextTile = createTile(value, tileSize, tileSize, position);
      console.log(nextTile.position);
      scene.add(nextTile);
      console.log("staring recursion");
      //createTilesRecursive(value, position, scene);
    }
  }
  return;
}

export function useLabyrinthFactory() {
  return {
    createLabyrinth,
  };
}
