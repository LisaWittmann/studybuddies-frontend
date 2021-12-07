import { Vector3 } from "three";
import { Orientation } from "@/service/Tile";
import { direction, position, settings } from "@/service/scene/helper/SceneConstants";
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
  orientations: Array<string>;
  calcPosition: Vector3;

  constructor(
    id: number,
    modelName: string,
    positionInRoom: string,
    orientations: Array<string>,
    calcPosition: Vector3
  ) {
    this.id = id;
    this.modelName = modelName;
    this.positionInRoom = (<any>Position)[positionInRoom];
    this.orientations = orientations;
    this.calcPosition = calcPosition;
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
      const currentOrientation: Orientation = (<any>Orientation)[orientation];
      const directionVector = new Vector3();

      switch (currentOrientation) {
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
      const currentOrientation: Orientation = (<any>Orientation)[orientation];
      switch (currentOrientation) {
        case Orientation.NORTH:
          viewdirection += 0;
          break;
        case Orientation.EAST:
          viewdirection += 270;
          break;
        case Orientation.SOUTH:
          viewdirection += 180;
          break;
        case Orientation.WEST:
          viewdirection += 90;
          break;
      }
    });

    //bisect angle of orientation to get view direction into corners
    if (this.orientations.length == 2) {
      viewdirection = viewdirection / 2;
    }
    return radians(viewdirection);
  };
}
