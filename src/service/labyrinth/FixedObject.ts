import { Vector3 } from "three";
import { Orientation } from "@/service/labyrinth/Tile";
import {
  settings,
  colors,
  directionMap,
  rotations,
} from "@/service/scene/helper/SceneConstants";

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
    const rotation = rotations.get(this.orientation);
    return rotation ? rotation : 0;
  };

  /**
   * calculates position of static item based on tile position, given orientation and distance
   * @param distance: distance from central point of tile in orientation direction
   * @returns global position of item
   */
  protected getPosition(distance: number): Vector3 {
    const position = new Vector3().copy(this.tilePosition);
    const direction = directionMap.get(this.orientation);
    if (direction) position.addScaledVector(direction, distance);
    return position;
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
  color = colors.arrow;

  position = (): Vector3 => {
    return this.getPosition(settings.tileSize / 2 - 2);
  };
}
