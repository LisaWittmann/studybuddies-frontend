import * as THREE from "three";
import { useTileFactory } from "@/service/scene/TileFactory";
import { Labyrinth } from "@/service/Labyrith";
import { Orientation, Tile } from "@/service/Tile";
import { vector } from "./helper/GeometryHelper";

/**
 * gets Map of all Tiles of a Labyrinth
 * creates them using TileFactory
 * adds Tiles to scene
 * @param labyrinthState
 * @param scene
 */
function createLabyrinth(labyrinth: Labyrinth, scene: THREE.Scene) {
  const { createTile } = useTileFactory();
  const tileMap = labyrinth.tileMap;
  const tileSize = 20;

  // add fist tile on position 0, 0, 0
  const currentTile = tileMap.get(1) as Tile;
  const position = vector(0, 0, 0);
  scene.add(createTile(currentTile, tileSize, tileSize, position));
}

/**
 * @todo calculate position of tile
 * @param tile
 * @returns
 */
function calculatePosition(position: THREE.Vector3, orientation: Orientation): THREE.Vector3 {
  return new THREE.Vector3(1, 1, 1);
}
/**
 * @returns functions to use LabyrinthFactory
 */
export function useLabyrinthFactory() {
  return {
    createLabyrinth,
  };
}
