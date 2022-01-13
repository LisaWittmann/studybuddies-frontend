import { Orientation } from "@/service/labyrinth/Tile";
import { Position } from "@/service/labyrinth/Item";
import { Role } from "@/service/game/Player";

/**
 * two dimensional vector
 */
export class Vector2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getNorth(): Vector2 {
    return new Vector2(this.x, this.y - 1);
  }

  getSouth(): Vector2 {
    return new Vector2(this.x, this.y + 1);
  }

  getEast(): Vector2 {
    return new Vector2(this.x + 1, this.y);
  }

  getWest(): Vector2 {
    return new Vector2(this.x - 1, this.y);
  }
}

/**
 * model of a tile
 * contains all attributes of a tile and additional data
 * for creation and representation
 */
export class TileModel {
  position: Vector2;
  isSelectable: boolean;
  isStart: boolean;
  isEnd: boolean;
  relationKey: number | undefined;
  tileRelationMap: Map<Orientation, TileModel | undefined>;
  objectsInRoom: Array<ItemModel>;
  restrictions: Array<Role>;
  placements: Array<Array<Orientation>>;

  constructor(position: Vector2) {
    this.position = position;

    this.relationKey = undefined;
    this.isSelectable = true;
    this.isEnd = false;
    this.isStart = false;

    this.tileRelationMap = new Map<Orientation, TileModel | undefined>();
    this.tileRelationMap.set(Orientation.NORTH, undefined);
    this.tileRelationMap.set(Orientation.EAST, undefined);
    this.tileRelationMap.set(Orientation.SOUTH, undefined);
    this.tileRelationMap.set(Orientation.WEST, undefined);

    this.placements = new Array<Array<Orientation>>();
    this.objectsInRoom = new Array<ItemModel>();
    this.restrictions = new Array<Role>();
  }

  hasPosition(x: number, y: number): boolean {
    return this.position.x == x && this.position.y == y;
  }

  hasChanges(): boolean {
    return (
      this.restrictions.length > 0 ||
      this.objectsInRoom.length > 0 ||
      this.isEnd ||
      this.isStart
    );
  }

  getNeighborsAsList(): Array<TileModel> {
    const neighborList = new Array<TileModel>();
    for (const tile of this.tileRelationMap.values()) {
      if (tile?.relationKey) neighborList.push(tile);
    }
    return neighborList;
  }

  getNeighborPosition(orientation: Orientation): Vector2 {
    switch (orientation) {
      case Orientation.NORTH:
        return this.position.getNorth();
      case Orientation.EAST:
        return this.position.getEast();
      case Orientation.SOUTH:
        return this.position.getSouth();
      case Orientation.WEST:
        return this.position.getWest();
    }
  }

  setPlacements(): void {
    this.placements.push(
      [Orientation.NORTH, Orientation.EAST],
      [Orientation.EAST, Orientation.SOUTH],
      [Orientation.SOUTH, Orientation.WEST],
      [Orientation.NORTH, Orientation.WEST]
    );
    for (const [orientation, tile] of this.tileRelationMap) {
      if (!tile?.relationKey) this.placements.push([orientation]);
    }
  }

  removePlacement(placement: Array<Orientation>): void {
    this.placements = this.placements.filter((p) => p != placement);
  }
}

export class ItemModel {
  modelName: string;
  positionInRoom: Position;
  orientations: Array<Orientation>;

  constructor(modelName: string) {
    this.modelName = modelName;
    this.positionInRoom = Position.FLOOR;
    this.orientations = new Array<Orientation>();
  }
}
