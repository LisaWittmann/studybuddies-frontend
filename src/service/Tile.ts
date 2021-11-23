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
  tileRelationMap: Map<Orientation, Tile | undefined>;
  objectsInRoom: Array<Item>;

  constructor(
    tileId: number,
    tileRelationMap: Map<Orientation, Tile | undefined>,
    objectsInRoom: Array<Item>
  ) {
    this.tileId = tileId;
    this.tileRelationMap = tileRelationMap;
    this.objectsInRoom = objectsInRoom;
  }

  getId() {
    return this.tileId;
  }

  getTileRelationMap() {
    return this.tileRelationMap;
  }

  getRoomObjects() {
    return this.objectsInRoom;
  }
}
