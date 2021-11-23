/**
 * Enumeration to align the tiles according to cardinal points.
 * (export is only for dummy objects)
 * @todo remov export for testing
 */
export enum Orientation {
  NORTH,
  EAST,
  SOUTH,
  WEST,
}

export interface TileRelation {
  orientation: Orientation;
  tile: number | undefined;
}

/**
 * item object to make an empty test Object to fill the tile
 * (Maybe outsource it in next sprints with more attributs)
 * (export is only for dummy objects)
 * @todo outsource it for next sprints
 * @todo remove export for testing
 */
export class Item {
  id: number;

  constructor(id: number) {
    this.id = id;
  }
}

/**
 * Datatype "Tile" which will be filled by parsing the JSON with the labyrinth structure.
 */
export class Tile {
  tileId: number;
  tileRelationMap: Map<Orientation, number | undefined>;
  objectsInRoom: Array<Item>;

  constructor(
    tileId: number,
    tileRelationMap: Map<Orientation, number | undefined> | undefined,
    objectsInRoom: Array<Item>
  ) {
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

  setTileRelationMap(map: Map<Orientation, number | undefined>) {
    this.tileRelationMap = map;
  }
}
