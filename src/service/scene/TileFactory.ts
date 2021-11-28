import * as THREE from "three";
import { useObjectFactory } from "@/service/scene/ObjectFactory";
import { Tile } from "@/service/Tile";
import { tileSize } from "@/service/scene/helper/Constants";

/**
 * creates a group of objects representing a tile
 * @param model: representing tile data
 * @param position: position in scene
 * @param color: color of all walls
 * @returns initialized group of scene objects
 */
function createTile(
  model: Tile,
  position: THREE.Vector3,
  color = 0xa9a9a9
): THREE.Group {
  const { createFloor, createCeiling, createArrow, createWall, createItem } = useObjectFactory();
  const tile = new THREE.Group();
  tile.position.copy(position);
  tile.userData = model;

  //LIGHT-----------------
  tile.add(createLight(position));

  //STATIC-ITEMS----------
  tile.add(createFloor(position, color));
  tile.add(createCeiling(position, color));
  model.tileRelationMap.forEach((value, key) => {
    if (value) createArrow(key, position, tile);
    else tile.add(createWall(key, position, color));
  });

  //ITEMS-----------------
  for (const item of model.objectsInRoom) {
    createItem(item, tile, item.positionInRoom);
  }
  console.log(tile);
  return tile;
}

/**
 * creates point light underneath top plane
 * @param position: center position of tile
 * @param height: height of tile
 * @returns: point light
 */
function createLight(position: THREE.Vector3) {
  const light = new THREE.PointLight(0xffffff, 0.5, 50, 2);
  light.position.set(position.x, position.y + tileSize - 10, position.z);
  return light;
}

export function useTileFactory() {
  return { createTile };
}
