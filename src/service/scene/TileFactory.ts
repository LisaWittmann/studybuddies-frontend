import * as THREE from "three";
import { useObjectFactory } from "@/service/scene/ObjectFactory";
import { Orientation, Tile } from "@/service/Tile";
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
  const tile = new THREE.Group();
  const { createFloor, createCeiling } = useObjectFactory();
  tile.position.copy(position);
  tile.userData = model;

  //LIGHT-----------------
  tile.add(createLight(position));

  //STATIC-ITEMS----------
  tile.add(createFloor(position, color));
  tile.add(createCeiling(position, color));
  model.tileRelationMap.forEach((value, key) => {
    const object = createStaticItem(position, key, value, color);
    tile.add(object);
  });

  //ITEMS-----------------

  return tile;
}

/**
 * creates static tile object based on given relation
 * creates arrow to naviagte to next tile if relation exists
 * creates wall if no relation exists
 * @param position: position of tile
 * @param orientation: orientation of tile relation
 * @param tile: tile of tile relation
 * @param color: color of walls
 * @returns wall or navigation arrow object
 */
function createStaticItem(
  position: THREE.Vector3,
  orientation: Orientation,
  tile: number | undefined,
  color = 0xa9a9a9
): THREE.Mesh {
  const { createArrow, createWall } = useObjectFactory();
  if (tile) return createArrow(orientation, position);
  return createWall(orientation, position, color);
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
