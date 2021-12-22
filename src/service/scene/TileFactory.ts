import * as THREE from "three";
import { useObjectFactory } from "@/service/scene/ObjectFactory";
import { Orientation, Tile } from "@/service/labyrinth/Tile";
import { Role } from "@/service/game/Player";
import { settings } from "@/service/scene/helper/SceneConstants";

/**
 * creates a group of objects representing a tile
 * @param model: representing tile data
 * @param position: position in scene
 * @param role: role of main player
 * @param neighbors: neighbor tiles with orientations
 * @param color: color of all walls
 * @returns initialized group of scene objects
 */
function createTile(
  tileKey: number,
  model: Tile,
  position: THREE.Vector3,
  role: Role | undefined,
  neighbors: Map<Orientation, Tile | undefined>,
  color = 0xa9a9a9
): THREE.Group {
  const { createFloor, createCeiling, createArrow, createWall, createItem } =
    useObjectFactory();
  const tile = new THREE.Group();
  tile.userData = model;
  tile.userData.tileId = tileKey;

  //LIGHT-----------------
  tile.add(createLight(position));

  //STATIC-ITEMS----------
  tile.add(createFloor(position, color, tileKey));
  tile.add(createCeiling(position, color));
  neighbors.forEach((neighbor, orientation) => {
    if (neighbor) {
      if (role && neighbor.getRestrictions().includes(role)) {
        createWall(orientation, position, color, 0.5);
      } else createArrow(orientation, position, tile);
    } else tile.add(createWall(orientation, position, color));
  });

  //ITEMS-----------------
  for (const item of model.objectsInRoom) {
    createItem(item, tile, position);
  }
  return tile;
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
