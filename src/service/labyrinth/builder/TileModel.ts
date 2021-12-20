import { Orientation } from "@/service/labyrinth/Tile";
import { Item } from "@/service/labyrinth/Item";

export class Vector2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getNorth(): Vector2 {
    return new Vector2(this.x, this.y + 1);
  }

  getSouth(): Vector2 {
    return new Vector2(this.x, this.y - 1);
  }

  getEast(): Vector2 {
    return new Vector2(this.x + 1, this.y);
  }

  getWest(): Vector2 {
    return new Vector2(this.x - 1, this.y);
  }
}

export class TileModel {
  position: Vector2;
  isSelectable: boolean;
  isSelected: boolean;
  isStart: boolean;
  isEnd: boolean;
  relationKey: number | undefined;
  tileRelationMap: Map<Orientation, TileModel | undefined>;
  objectsInRoom: Array<Item>;

  constructor(position: Vector2) {
    this.position = position;
    this.isSelectable = true;
    this.isSelected = false;
    this.isEnd = false;
    this.isStart = false;
    this.relationKey = undefined;
    this.tileRelationMap = new Map<Orientation, TileModel | undefined>();
    this.tileRelationMap.set(Orientation.NORTH, undefined);
    this.tileRelationMap.set(Orientation.EAST, undefined);
    this.tileRelationMap.set(Orientation.SOUTH, undefined);
    this.tileRelationMap.set(Orientation.WEST, undefined);
    this.objectsInRoom = new Array<Item>();
  }

  select(): void {
    this.isSelected = true;
    this.isSelectable = false;
  }

  hasPosition(x: number, y: number): boolean {
    return this.position.x == x && this.position.y == y;
  }

  getNeighbour(orientation: Orientation): Vector2 {
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
}
