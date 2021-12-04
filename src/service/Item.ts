import { Vector3 } from "three";

/**
 * enumeration of vertical object position in tile
 */
export enum Position {
  WALL,
  BOTTOM,
  CEILING,
}

/**
 * interactive items in tile
 * passed in by JSON
 * contains name of object model in public folder
 * and informations to calculate position in tile
 */
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
