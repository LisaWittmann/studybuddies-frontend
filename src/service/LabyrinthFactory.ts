import * as THREE from "three";
import { Tile, Orientation } from "@/service/Tile";
import { useTileFactory } from "@/service/TileFactory";

const { createTile, addWall } = useTileFactory();

//examples -> todo: get from Tile.ts
const tileSize = 20;
const color = 0xa9a9a9;

/**
 * gets Map of all Tiles of a Labyrinth
 * creates them using TileFactory
 * adds Tiles to scene
 * @param labyrinthState
 * @param scene
 */
function createLabyrinth(
  labyrinthState: Map<number, Tile>,
  scene: THREE.Scene
) {
  labyrinthState.forEach((value: Tile, key: number) => {
    let tilePosition = new THREE.Vector3(0, 0, 0);
    let tile = new THREE.Group();
    if (key === 1) {
      //first Tile
      //todo: write as external method
      tile = createTile({ width: tileSize, height: tileSize }, tilePosition);
      value.tileRelationMap.forEach((value: Tile, key: Orientation) => {
        if (value) {
          console.log("value: " + value);
          //add next Tile
        } else {
          //add wall on side of Orientation
          console.log("wall on " + key);
          addWall(key, tilePosition);
        }
      });
    } else {
      tilePosition = calculatePosition(value);
    }
    scene.add(tile);
  });
}

/**
 * @todo calculate position of tile
 * @param tile
 * @returns
 */
function calculatePosition(tile: Tile): THREE.Vector3 {
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
