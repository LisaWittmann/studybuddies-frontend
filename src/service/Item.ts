import { Vector3 } from "three";
import { Orientation } from "@/service/Tile";
import { direction, position, settings } from "./scene/helper/SceneConstants";

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
    this.positionInRoom = (<any>Position)[positionInRoom]; //convert string from JSON to Enum
    this.orientations = orientations;
    this.calcPosition = calcPosition;

    //Konvertierung zu Enum notwendig????
    /* const ori = new Array<Orientation>();
    for (const o in orientations) {
      const newO: Orientation = (<any>Orientation)[o];
      console.log(typeof newO);
      ori.push(newO);
    }

    this.orientations = ori; */
  }

  /**
   *
   * @returns height where item is positioned
   */
  calcPositionInRoom = (): Vector3 => {
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

    //pan calculation
    this.orientations.forEach((o) => {
      //cast string from array to enum for simple use of enum in switch
      const eO: Orientation = (<any>Orientation)[o];
      const directionVector = new Vector3();

      switch (eO) {
        case Orientation.NORTH:
          console.log("switch north");
          directionVector.copy(direction.north);
          this.calcPosition = this.calcPosition.add(directionVector);
          break;
        case Orientation.EAST:
          console.log("switch east");
          directionVector.copy(direction.east);
          this.calcPosition = this.calcPosition.add(directionVector);
          break;
        case Orientation.SOUTH:
          console.log("switch south");
          directionVector.copy(direction.south);
          this.calcPosition = this.calcPosition.add(directionVector);
          break;
        case Orientation.WEST:
          console.log("switch west");
          directionVector.copy(direction.west);
          this.calcPosition = this.calcPosition.add(directionVector);
          break;
        default:
          console.log("default");
      }
    });

    //move item quarter of the current tile size
    this.calcPosition = this.calcPosition.multiplyScalar(settings.tileSize / 4);
    console.log(this.calcPosition);

    return this.calcPosition;
  };

  /**
   *
   * @returns how many degrees object must be rotated
   */
  /* rotationY = (): number => {
    let viewdirection = 0;
    this.orientations.forEach((o) => {
      switch (o) {
        case Orientation.NORTH:
          
          break;
        case Orientation.EAST:
          break;
        case Orientation.SOUTH:
          break;
        case Orientation.WEST:
          break;
      }
    });



      switch (this.orientation) {
        case Orientation.NORTH:
          return 0;
        case Orientation.EAST:
          return 270;
        case Orientation.SOUTH:
          return 180;
        case Orientation.WEST:
          return 90;
      }
    };
    
    

  }; */
}
