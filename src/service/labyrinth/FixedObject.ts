import { Vector3 } from "three";
import { Orientation } from "@/service/labyrinth/Tile";
import { radians } from "@/service/scene/helper/GeometryHelper";
import {
  settings,
  direction,
  colors,
} from "@/service/scene/helper/SceneConstants";
import { Role } from "../game/Player";

/**
 * base class of static items in scene like walls and arrows
 * that are not included in objects in room
 * contains items orientation and parent tile's position for calculation
 */
class FixedObject {
  orientation: Orientation;
  tilePosition: Vector3;

  constructor(orientation: Orientation, tilePosition: Vector3) {
    this.orientation = orientation;
    this.tilePosition = tilePosition;
  }

  rotationY = (): number => {
    switch (this.orientation) {
      case Orientation.NORTH:
        return radians(0);
      case Orientation.EAST:
        return radians(270);
      case Orientation.SOUTH:
        return radians(180);
      case Orientation.WEST:
        return radians(90);
    }
  };

  /**
   * calculates position of static item based on tile position, given orientation and distance
   * @param distance: distance from central point of tile in orientation direction
   * @returns global position of item
   */
  protected getPosition(distance: number): Vector3 {
    const position = new Vector3().copy(this.tilePosition);
    switch (this.orientation) {
      case Orientation.NORTH:
        return position.addScaledVector(direction.north, distance);
      case Orientation.EAST:
        return position.addScaledVector(direction.east, distance);
      case Orientation.SOUTH:
        return position.addScaledVector(direction.south, distance);
      case Orientation.WEST:
        return position.addScaledVector(direction.west, distance);
    }
  }
}

/**
 * wall of tile
 * contains orientation where it should be placed
 */
export class Wall extends FixedObject {
  position = (): Vector3 => {
    return this.getPosition(settings.tileSize / 2);
  };
}

/**
 * navigation arrow of tile
 * is only visible in current tile when facing its orientation
 * contains orientation where it directs to
 */
export class Arrow extends FixedObject {
  showInView = true;
  modelName = "arrow";
  color: number;

  constructor(
    orientation: Orientation,
    tilePosition: Vector3,
    role: Role | undefined
  ) {
    super(orientation, tilePosition);
    this.color = role == Role.HACKER ? colors.hacker : colors.designer;
  }

  position = (): Vector3 => {
    return this.getPosition(settings.tileSize / 2 - 2);
  };
}
