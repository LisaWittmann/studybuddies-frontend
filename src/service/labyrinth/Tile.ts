import { Item } from "@/service/labyrinth/Item";
import { Role } from "@/service/game/Player";

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
  restrictions: Array<Role>;

  constructor(tileId: number, objectsInRoom: Array<Item>, restrictions: Array<Role>) {
    this.tileId = tileId;
    this.objectsInRoom = objectsInRoom;
    this.restrictions = restrictions;
    this.tileRelationMap = new Map<Orientation, number | undefined>();
    console.log(this);
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

  getRestrictions(): Array<Role> {
    return this.restrictions;
  }

  setTileRelationMap(map: Map<Orientation, number | undefined>): void {
    this.tileRelationMap = map;
  }

  setRestrictions(restrictions: Array<Role>): void {
    this.restrictions = restrictions;
  }

  isRestricedFor(role: Role): boolean {
    return this.restrictions.includes(role);
  }
}
