import * as THREE from "three";
import { useObjectFactory } from "@/service/scene/ObjectFactory";
import { Orientation, Tile } from "@/service/Tile";
import { settings } from "@/service/scene/helper/SceneConstants";

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
  const { createFloor, createCeiling, createItem } = useObjectFactory();
  const tile = new THREE.Group();
  tile.userData = model;

  //LIGHT-----------------
  tile.add(createLight(position));

  //STATIC-ITEMS----------
  tile.add(createFloor(position, color));
  tile.add(createCeiling(position, color));
  model.tileRelationMap.forEach((value, key) => {
    const object = createFixedObject(position, key, value, color);
    tile.add(object);
  });

  //ITEMS-----------------
  for (const item of model.objectsInRoom) {
    createItem(item, tile);
  }

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
function createFixedObject(
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
  const light = new THREE.PointLight(0xffffff, 1, 50, 2);
  light.position.set(
    position.x,
    position.y + settings.tileSize / 2,
    position.z
  );
  return light;
}

export function useTileFactory() {
  return { createTile };
}
