import { Vector3 } from "three";
import { tileSize, direction } from "@/service/scene/helper/Constants";

/**
 * enumeration of cardinal points for object positioning
 */
export enum Orientation {
  NORTH,
  EAST,
  SOUTH,
  WEST,
}

export class Item {
  id: number;
  modelName: string;
  positionInRoom: Vector3;

  constructor(id: number, modelName: string, positionInRoom: Vector3) {
    this.id = id;
    this.modelName = modelName;
    this.positionInRoom = positionInRoom;
  }
}

/**
 * datatype "Tile" which will be filled by parsing the JSON with the labyrinth structure
 * contains relation to surrounding tiles and items that sould be placed inside of tile
 */
export class Tile {
  tileId: number;
  tileRelationMap: Map<Orientation, number | undefined>;
  objectsInRoom: Array<Item>;

  constructor(tileId: number, objectsInRoom: Array<Item>) {
    this.tileId = tileId;
    this.objectsInRoom = objectsInRoom;
    this.tileRelationMap = new Map<Orientation, number | undefined>();
  }

  getId(): number {
    return this.tileId;
  }

  getTileRelationMap(): Map<Orientation, number | undefined> {
    return this.tileRelationMap;
  }

  getRoomObjects(): Array<Item> {
    return this.objectsInRoom;
  }

  setTileRelationMap(map: Map<Orientation, number | undefined>): void {
    this.tileRelationMap = map;
  }
}

/**
 * base class of static items in scene like walls and arrows
 * that are not included in objects in room
 * contains items orientation and parent tile's position for calculation
 */
class StaticItem {
  orientation: Orientation;
  tilePosition: Vector3;

  constructor(orientation: Orientation, tilePosition: Vector3) {
    this.orientation = orientation;
    this.tilePosition = tilePosition;
  }

  rotationY = (): number => {
    switch (this.orientation) {
      case Orientation.NORTH:
        return 0;
      case Orientation.EAST:
        return 90;
      case Orientation.SOUTH:
        return 180;
      case Orientation.WEST:
        return 270;
    }
  };

  /**
   * calculates position of static item based on tilePostion, given orientation and distance
   * @param distance: distance from central point of tile in orientation direction
   * @returns global position of item
   */
  protected getPosition(distance: number): Vector3 {
    const position = new Vector3().copy(this.tilePosition);
    switch (this.orientation) {
      case Orientation.NORTH:
        return position.addScaledVector(direction.north, distance);
      case Orientation.EAST:
        return position.addScaledVector(direction.east, distance);
      case Orientation.SOUTH:
        return position.addScaledVector(direction.south, distance);
      case Orientation.WEST:
        return position.addScaledVector(direction.west, distance);
    }
  }
}

/**
 * wall of tile
 * contains orientation where it should be placed
 */
export class Wall extends StaticItem {
  position = (): Vector3 => {
    return this.getPosition(tileSize / 2);
  };
}

/**
 * navigation arrow of tile
 * is only visible in current tile when facing its orientation
 * contains orientation where it directs to
 */
export class Arrow extends StaticItem {
  showInView = true;
  clickable = true;

  position = (): Vector3 => {
    return this.getPosition(tileSize / 2 - 1);
  };
}
