import { Vector3 } from "three";
import { Orientation } from "@/service/labyrinth/Tile";
import { radians } from "@/service/scene/helper/GeometryHelper";
import {
  direction,
  position,
  settings,
} from "@/service/scene/helper/SceneConstants";

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
 * and information to calculate position in tile
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
          break;
        case Orientation.EAST:
          directionVector.copy(direction.east);
          break;
        case Orientation.SOUTH:
          directionVector.copy(direction.south);
          break;
        case Orientation.WEST:
          directionVector.copy(direction.west);
          break;
      }
      this.calcPosition.copy(this.calcPosition.clone().add(directionVector));
    });

    //move item quarter of the current tile size
    this.calcPosition = this.calcPosition.multiplyScalar(settings.tileSize / 4);
    return this.calcPosition;
  };

  /**
   * currently rotates item so that the front of the item is always pointed at the user
   * rotation counterclockwise
   * @returns how many degrees object must be rotated
   */
  rotationY = (): number => {
    let viewDirection = 0;
    this.orientations.forEach((orientation) => {
      switch (orientation) {
        case Orientation.NORTH:
          viewDirection += 0;
          break;
        case Orientation.EAST:
          viewDirection += 90;
          break;
        case Orientation.SOUTH:
          viewDirection += 180;
          break;
        case Orientation.WEST:
          viewDirection += 270;
          break;
      }
    });

    //bisect angle of orientation to get view direction into corners
    if (this.orientations.length == 2) {
      viewDirection = viewDirection / 2;
    }
    return radians(viewDirection);
  };

  toJsonObject() {
    return {
      id: this.id,
      modelName: this.modelName,
      positionInRoom: Position[this.positionInRoom],
      orientations: this.orientations.map(
        (orientation) => Orientation[orientation]
      ),
    };
  }
}
