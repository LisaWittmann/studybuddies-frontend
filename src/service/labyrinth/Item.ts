import { Vector3 } from "three";
import { Orientation } from "@/service/labyrinth/Tile";
import {
  direction,
  position,
  settings,
} from "@/service/scene/helper/SceneConstants";
import { radians } from "@/service/scene/helper/GeometryHelper";

/**
 * enumeration of vertical object position in tile
 */
export enum Position {
  WALL,
  FLOOR,
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
  positionInRoom: Position;
  orientations: Array<Orientation>;
  calcPosition: Vector3;

  constructor(
    id: number,
    modelName: string,
    positionInRoom: Position,
    orientations: Array<Orientation>
  ) {
    this.id = id;
    this.modelName = modelName;
    this.positionInRoom = positionInRoom;
    this.orientations = orientations;
    this.calcPosition = new Vector3();
  }

  /**
   *
   * @returns height where item is positioned
   */
  calcPositionInRoom = (): Vector3 => {
    //set vertical position
    switch (this.positionInRoom) {
      case Position.FLOOR:
        this.calcPosition.copy(position.floor);
        break;
      case Position.WALL:
        this.calcPosition.copy(position.wall);
        break;
      case Position.CEILING:
        this.calcPosition.copy(position.ceiling);
        break;
    }

    //calculation for object positioning
    //set horizontal position
    this.orientations.forEach((orientation) => {
      //cast string from array to enum for simple use of enum in switch
      const directionVector = new Vector3();
      switch (orientation) {
        case Orientation.NORTH:
          directionVector.copy(direction.north);
          this.calcPosition = this.calcPosition.add(directionVector);
          break;
        case Orientation.EAST:
          directionVector.copy(direction.east);
          this.calcPosition = this.calcPosition.add(directionVector);
          break;
        case Orientation.SOUTH:
          directionVector.copy(direction.south);
          this.calcPosition = this.calcPosition.add(directionVector);
          break;
        case Orientation.WEST:
          directionVector.copy(direction.west);
          this.calcPosition = this.calcPosition.add(directionVector);
          break;
      }
    });

    //move item quarter of the current tile size
    this.calcPosition = this.calcPosition.multiplyScalar(settings.tileSize / 4);

    return this.calcPosition;
  };

  /**
   * currently rotates item so that the front of the item is always pointed at the user
   * rotation counter clockwise
   * @returns how many degrees object must be rotated
   */
  rotationY = (): number => {
    let viewdirection = 0;
    this.orientations.forEach((orientation) => {
      switch (orientation) {
        case Orientation.NORTH:
          viewdirection += 0;
          break;
        case Orientation.EAST:
          viewdirection += 90;
          break;
        case Orientation.SOUTH:
          viewdirection += 180;
          break;
        case Orientation.WEST:
          viewdirection += 270;
          break;
      }
    });

    //bisect angle of orientation to get view direction into corners
    if (this.orientations.length == 2) {
      viewdirection = viewdirection / 2;
    }
    return radians(viewdirection);
  };

  toJsonObject() {
    const orientationsString = new Array<string>();
    for (const orientation of this.orientations) {
      switch (orientation) {
        case Orientation.NORTH:
          orientationsString.push("NORTH");
          break;
        case Orientation.SOUTH:
          orientationsString.push("SOUTH");
          break;
        case Orientation.WEST:
          orientationsString.push("WEST");
          break;
        case Orientation.EAST:
          orientationsString.push("EAST");
          break;
      }
    }
    let position = "";
    switch (this.positionInRoom) {
      case Position.FLOOR:
        position = "FLOOR";
        break;
      case Position.CEILING:
        position = "CEILING";
        break;
      case Position.WALL:
        position = "WALL";
        break;
    }
    return {
      id: this.id,
      modelName: this.modelName,
      positionInRoom: position,
      orientations: orientationsString,
    };
  }
}
