import { Vector3 } from "three";
import { Orientation } from "@/service/labyrinth/Tile";
import { radians } from "@/service/scene/helper/GeometryHelper";
import { directionMap, settings } from "@/service/scene/helper/SceneConstants";

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
  orientations: Array<Orientation>;
  calcPosition: Vector3;

  constructor(id: number, modelName: string, orientations: Array<Orientation>) {
    this.id = id;
    this.modelName = modelName;
    this.orientations = orientations;
    this.calcPosition = new Vector3();
  }

  /**
   *
   * @returns height where item is positioned
   */
  calcPositionInRoom = (): Vector3 => {
    //calculation for object positioning
    //set horizontal position
    this.orientations.forEach((orientation) => {
      //cast string from array to enum for simple use of enum in switch
      const directionVector = new Vector3();
      const direction = directionMap.get(orientation);

      if (direction) directionVector.copy(direction);
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
    const fullOrientation = this.orientations
      .map((orientation) => Orientation[orientation])
      .toString()
      .replace(",", "");
    console.log("Orientation: ", fullOrientation);

    if (fullOrientation === "NORTH") {
      viewDirection = 0;
    } else if (fullOrientation === "EAST" || fullOrientation === "WEST") {
      viewDirection = 90;
    } else if (fullOrientation === "SOUTH") {
      viewDirection = 180;
    } else if (
      fullOrientation === "NORTHEAST" ||
      fullOrientation === "EASTNORTH" ||
      fullOrientation === "NORTHWEST" ||
      fullOrientation === "WESTNORTH"
    ) {
      viewDirection = 45;
    } else if (
      fullOrientation === "SOUTHEAST" ||
      fullOrientation === "EASTSOUTH" ||
      fullOrientation === "SOUTHWEST" ||
      fullOrientation === "WESTSOUTH"
    ) {
      viewDirection = 135;
    }

    //check direction of rotation; EAST -> rotate clockwise
    if (fullOrientation.includes("EAST")) {
      viewDirection = viewDirection * -1;
    }

    return radians(viewDirection);
  };

  toJsonObject() {
    return {
      id: this.id,
      modelName: this.modelName,
      orientations: this.orientations.map(
        (orientation) => Orientation[orientation]
      ),
    };
  }
}
