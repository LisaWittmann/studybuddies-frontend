import * as THREE from "three";
import { Orientation, Tile } from "@/service/Tile";
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
  width: number,
  height: number,
  position: THREE.Vector3,
  color = 0xa9a9a9
): THREE.Group {
  const tile = new THREE.Group();
  const { createObject } = useObjectFactory();
  tile.position.copy(position);
  tile.userData.id = model.getId();

  //LIGHT-----------------
  tile.add(createLight(position, height));

  //CONSTANTS-------------
  const bottom = position;
  const top = vector(position.x, height, position.z);

  //STATIC-OBJECTS--------
  const plane = new Plane(height, width);
  tile.add(
    createObject(plane, bottom, color, false, true, vector(1, 0, 0), 90)
  );
  tile.add(createObject(plane, top, color, false, true, vector(1, 0, 0), 90));

  model.tileRelationMap.forEach((value, key) => {
    tile.add(createStaticObject(width, height, position, key, value, color));
  });

  return tile;
}

function createStaticObject(
  width: number,
  height: number,
  position: THREE.Vector3,
  orientation: Orientation,
  tile: number | undefined,
  color = 0xa9a9a9
): THREE.Mesh {
  const { createObject } = useObjectFactory();

  const wall = new Plane(width, height);
  const arrow = new Cuboid(1, 1, 2);

  const wallColor = color;
  const arrowColor = 0xeaf4ea;

  const north = vector(position.x, position.y, position.z - width / 2);
  const east = vector(position.x + width / 2, position.y, position.z);
  const south = vector(position.x, position.y, position.z + width / 2);
  const west = vector(position.x - width / 2, position.y, position.z);

  switch (orientation) {
    case Orientation.NORTH:
      if (tile) {
        return createObject(
          arrow,
          vector(north.x, north.y, north.z - 1),
          arrowColor,
          true,
          false
        );
      } else {
        return createObject(wall, north, wallColor, false);
      }
    case Orientation.EAST:
      if (tile) {
        return createObject(
          arrow,
          vector(east.x - 1, east.y, east.z),
          arrowColor,
          true,
          false,
          vector(0, 1, 0),
          90
        );
      } else {
        return createObject(
          wall,
          east,
          wallColor,
          false,
          true,
          vector(0, 1, 0),
          90
        );
      }
      break;
    case Orientation.SOUTH:
      if (tile) {
        return createObject(
          arrow,
          vector(south.x, south.y, south.z - 1),
          arrowColor,
          true,
          false
        );
      } else {
        return createObject(wall, south, wallColor, false);
      }
    case Orientation.WEST:
      if (tile) {
        return createObject(
          arrow,
          vector(west.x - 1, west.y, west.z),
          arrowColor,
          true,
          false,
          vector(0, 1, 0),
          90
        );
      } else {
        return createObject(
          wall,
          west,
          wallColor,
          false,
          true,
          vector(0, 1, 0),
          90
        );
      }
  }
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
