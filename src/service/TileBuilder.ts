import * as THREE from "three";
import { Tile } from "@/service/TestData";
import { radiant, baseline, vector } from "@/service/GeometryHelper";

/**
 * creates a group of planes representing a tile
 * @param model: representing tile data
 * @param position: position in scene
 * @param color: color of all walls
 * @returns created three.js group as tile
 */
function createTile(
  model: Tile,
  position: THREE.Vector3,
  color = 0xa9a9a9
): THREE.Group {
  // create group
  const tile = new THREE.Group();
  tile.position.set(position.x, position.y, position.z);

  // add bottom plane
  tile.add(
    createWall(
      model.width,
      model.width,
      color,
      false,
      position,
      vector(1, 0, 0),
      90
    )
  );

  // add top plane
  tile.add(
    createWall(
      model.width,
      model.width,
      color,
      false,
      vector(position.x, model.height, position.z),
      vector(1, 0, 0),
      90
    )
  );

  // add left plane
  tile.add(
    createWall(
      model.width,
      model.height,
      color,
      true,
      vector(position.x - model.width / 2, position.y, position.z),
      vector(0, 1, 0),
      90
    )
  );

  // add right plane
  tile.add(
    createWall(
      model.width,
      model.height,
      color,
      true,
      vector(position.x + model.width / 2, position.y, position.z),
      vector(0, 1, 0),
      90
    )
  );

  // add front plane
  tile.add(
    createWall(
      model.width,
      model.height,
      color,
      true,
      vector(position.x, position.y, position.z + model.width / 2)
    )
  );

  // add back plane
  tile.add(
    createWall(
      model.width,
      model.height,
      color,
      true,
      vector(position.x, position.y, position.z - model.width / 2)
    )
  );

  tile.add(createLight(position, model.height));

  return tile;
}

/**
 * creates 3D plane as wall representation
 * @param width: width of tile
 * @param height: height of tile
 * @param color: preferred color of walls
 * @param alignBaseline: deactivate automatic center positioning
 * @param position: global position of wall in tile
 * @param axis: rotating axis
 * @param angle: rotating angle in degree
 * @returns created threejs plane as wall
 */
function createWall(
  width: number,
  height = width,
  color = 0x000000,
  alignBaseline = false,
  position?: THREE.Vector3,
  axis?: THREE.Vector3,
  angle?: number
): THREE.Mesh {
  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshStandardMaterial({ color: color, side: THREE.DoubleSide })
  );
  if (position) {
    if (alignBaseline) {
      position = baseline(position, height);
    }
    wall.position.set(position.x, position.y, position.z);
  }
  if (axis && angle) {
    wall.rotateOnAxis(axis, radiant(angle));
  }
  return wall;
}

/**
 * creates point light underneath top plane
 * @param position: center position of tile
 * @param height: height of tile
 * @returns: point light
 */
function createLight(position: THREE.Vector3, height: number) {
  const light = new THREE.PointLight(0xffffff, 0.5, 50, 2);
  light.position.set(position.x, position.y + height - 5, position.z);
  return light;
}

export function useTileBuilder() {
  return { createTile };
}
