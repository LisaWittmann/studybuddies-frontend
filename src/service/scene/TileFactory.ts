import * as THREE from "three";
import { Tile } from "@/service/TestData";
import { Cuboid, Plane } from "@/service/Shape";
import { useObjectFactory } from "@/service/scene/ObjectFactory";
import { vector } from "@/service/scene/helper/GeometryHelper";

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
  const { createObject } = useObjectFactory();
  tile.position.copy(position);

  //LIGHT-----------------
  tile.add(createLight(position, model.height));

  //WALLS----------------
  const plane = new Plane(model.height, model.width);

  const bottom = position;
  const top = vector(position.x, model.height, position.z);
  const left = vector(position.x - model.width / 2, position.y, position.z);
  const right = vector(position.x + model.width / 2, position.y, position.z);
  const front = vector(position.x, position.y, position.z + model.width / 2);
  const back = vector(position.x, position.y, position.z - model.width / 2);

  tile.add(createObject(plane, bottom, color, false, vector(1, 0, 0), 90));
  tile.add(createObject(plane, top, color, false, vector(1, 0, 0), 90));

  tile.add(createObject(plane, left, color, false, vector(0, 1, 0), 90));
  tile.add(createObject(plane, right, color, false, vector(0, 1, 0), 90));
  tile.add(createObject(plane, front, color));
  tile.add(createObject(plane, back, color));

  //NAVIGATION------------
  const edgePosition = model.width / 2 - 1;
  const arrowColor = 0xeaf4ea;
  const arrow = new Cuboid(1, 1, 2);

  const north = vector(0, 0, -edgePosition);
  const east = vector(-edgePosition, 0, 0);
  const south = vector(0, 0, edgePosition);
  const west = vector(edgePosition, 0, 0);

  tile.add(createObject(arrow, north, arrowColor, true));
  tile.add(createObject(arrow, south, arrowColor, true));
  tile.add(createObject(arrow, east, arrowColor, true, vector(0, 1, 0), 90));
  tile.add(createObject(arrow, west, arrowColor, true, vector(0, 1, 0), 90));

  return tile;
}

// TODO: add coordinate converter for objects in tile pased on tile position

// TODO: check lightning in connected tiles

/**
 * creates point light underneath top plane
 * @param position: center position of tile
 * @param height: height of tile
 * @returns: point light
 */
function createLight(position: THREE.Vector3, height: number) {
  const light = new THREE.PointLight(0xffffff, 0.5, 50, 2);
  light.position.set(position.x, position.y + height - 10, position.z);
  return light;
}

export function useTileFactory() {
  return { createTile };
}
