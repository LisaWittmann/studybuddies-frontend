import * as THREE from "three";
import { useTileFactory } from "@/service/scene/TileFactory";
import { useSceneFactory } from "@/service/scene/SceneFactory";

import { Labyrinth } from "@/service/Labyrinth";
import { Orientation, Tile } from "@/service/Tile";

import { vector } from "@/service/scene/helper/GeometryHelper";
import { direction, settings } from "@/service/scene/helper/SceneConstants";

const { createTile } = useTileFactory();
const { updateCameraPosition } = useSceneFactory();

const storedTiles = new Map<number, THREE.Vector3>();

/**
 * gets map of all tiles of a Labyrinth
 * creates them using TileFactory
 * adds Tiles to scene
 * @param labyrinthState
 * @param scene
 */
async function createLabyrinth(labyrinth: Labyrinth, scene: THREE.Scene) {
  const position = vector(0, 0, 0);
  // for testing
  const startTile = labyrinth.playerStartTileIds[0];
  for (const [, value] of labyrinth.tileMap) {
    placeTile(position, value, scene);
    if (value.getId() == startTile) {
      placeCamera(position, value);
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

/**
 * places camera on position of player
 * and sets camera target to an orientation with a tile relation
 * so player won't face the wall when spawning
 * @param position: position of main player
 * @param tile: tile on which player is placed to check relations
 */
function placeCamera(position: THREE.Vector3, tile: Tile) {
  let orientation = Orientation.NORTH;
  for (const [key, value] of tile.getTileRelationMap()) {
    if (value) {
      orientation = key;
      break;
    }
  }
  updateCameraPosition(position, orientation);
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
    createLabyrinth,
  };
}
