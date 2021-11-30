import { Item } from "@/service/Objects";

/**
 * enumeration of cardinal points for object positioning
 */
export enum Orientation {
  NORTH,
  EAST,
  SOUTH,
  WEST,
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
