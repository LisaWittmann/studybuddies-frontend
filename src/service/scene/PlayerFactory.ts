import { Object3D, Scene, Vector3 } from "three";
import { useSceneFactory } from "@/service/scene/SceneFactory";
import { useObjectFactory } from "@/service/scene/ObjectFactory";

import { Player, MainPlayer, PartnerPlayer } from "@/service/game/Player";
import { Orientation, Tile } from "@/service/labyrinth/Tile";

import {
  direction,
  directionMap,
  factors,
  movementRotations,
} from "@/service/scene/helper/SceneConstants";

const { updateCameraPosition, updateCameraTarget } = useSceneFactory();
const { createPlayer, checkIntersect } = useObjectFactory();

let playerPosition: number | undefined;
let partnerPosition: number | undefined;

function resetPlayerData() {
  playerPosition = undefined;
  partnerPosition = undefined;
}

/**
 * check if stored data of players needs to be updated
 * @param player playerObject that might contain new data
 * @returns true if stored data is outdated
 */
function requiresUpdate(player: Player) {
  if (player instanceof MainPlayer) {
    return !playerPosition || player.getPosition() != playerPosition;
  } else if (player instanceof PartnerPlayer) {
    return !partnerPosition || player.getPosition() != partnerPosition;
  } else return false;
}

/**
 * update position of main player
 * @param player: main player
 * @param tilePosition: position of tile player should be placed on
 */
function updateMainPlayer(
  player: MainPlayer,
  tile: Tile | undefined,
  tilePosition: Vector3
) {
  if (requiresUpdate(player)) {
    updateCameraPosition(tilePosition);
    if (!playerPosition) {
      if (!tile) return;
      const relations = [...tile.getTileRelationMap().keys()];
      const orientation = relations.find((orientation) =>
        tile.getTileRelationMap().get(orientation)
      );
      if (orientation) updateCameraTarget(orientation);
    }
    playerPosition = player.getPosition();
  }
}

/**
 * update position of partner players
 * @param player: partner player
 * @param tilePosition: position of tile that player should be placed in
 * @param scene: scene containing player and tile objects
 */
async function updatePartnerPlayer(
  player: PartnerPlayer,
  tile: Tile | undefined,
  tilePosition: Vector3,
  scene: Scene
) {
  if (!player.getUsername() || !requiresUpdate(player)) {
    return;
  } else {
    const playerObject = scene.getObjectByName(player.getUsername());
    const position = calculatePartnerPositon(tile, tilePosition);
    if (!partnerPosition) {
      createPlayer(player, position, scene);
    } else if (playerObject) {
      rotatePlayer(playerObject, position);
      playerObject.position.copy(position);
      playerObject.position.copy(
        checkIntersect(playerObject, player.getPosition(), position, scene)
      );
    }
    partnerPosition = player.getPosition();
  }
}

/**
 * rotate playerObject to direction it will be translated to
 * @param object object of partnerPlayer
 * @param position position of tile that player should be placed in
 */
function rotatePlayer(object: Object3D, position: Vector3) {
  const moveDirection = new Vector3()
    .copy(object.position)
    .addScaledVector(position, -1)
    .normalize();

  for (const [orientation, direction] of directionMap) {
    if (direction.equals(moveDirection)) {
      const rotationAngle = movementRotations.get(orientation) as number;
      object.rotation.y = rotationAngle;
      return;
    }
  }
}

/**
 * calculating position of player in tile
 * @param tile: tile to which player has moved
 * @param tilePosition: vector position of tile that player should be placed in
 * @returns position as three dimensional vector
 */
function calculatePartnerPositon(
  tile: Tile | undefined,
  tilePosition: Vector3
): Vector3 {
  const tileItems = tile?.objectsInRoom;
  const itemOrientations = new Array<string>();

  //partner initially placed in the northwest corner
  let playerOrientation = "NORTHWEST";
  const calcPartnerPosition = new Vector3();
  const directionVector = new Vector3()
    .copy(direction.north)
    .add(direction.west)
    .multiplyScalar(factors.partnerTranslateFactor);

  //gets all orientations/positions of items in tile
  if (tileItems && tileItems?.length >= 1) {
    tileItems.forEach((item) => {
      let orientationStrings = item.orientations.map(
        (orientation) => Orientation[orientation]
      );
      orientationStrings = correctOrientation(orientationStrings);
      itemOrientations.push(orientationStrings.toString().replace(",", ""));
    });

    //while the planned corner for the player is taken by an item
    while (itemOrientations.includes(playerOrientation)) {
      //rotate the player position clockwise
      switch (playerOrientation) {
        case "NORTHWEST":
          playerOrientation = "NORTHEAST";
          directionVector
            .copy(direction.north)
            .add(direction.east)
            .multiplyScalar(factors.partnerTranslateFactor);
          break;
        case "NORTHEAST":
          playerOrientation = "SOUTHEAST";
          directionVector
            .copy(direction.south)
            .add(direction.east)
            .multiplyScalar(factors.partnerTranslateFactor);
          break;
        case "SOUTHEAST":
          playerOrientation = "SOUTHWEST";
          directionVector
            .copy(direction.south)
            .add(direction.west)
            .multiplyScalar(factors.partnerTranslateFactor);
          break;
        case "SOUTHWEST":
          playerOrientation = "NORTHWEST";
          directionVector
            .copy(direction.north)
            .add(direction.west)
            .multiplyScalar(factors.partnerTranslateFactor);
      }
    }
  }

  calcPartnerPosition.copy(tilePosition).add(directionVector);

  return calcPartnerPosition;
}

/**
 *
 * Corrects orientations of item so that only existing values are included.
 * These are (NORTH, WEST), (NORTH, EAST), (SOUTH, WEST), (SOUTH, EAST).
 * Checks if the first orientation in the orientations of an item are EAST or WEST and switches orientations accordingly.
 * @param orientationStrings
 * @returns corrected orientations
 */
function correctOrientation(orientationStrings: Array<string>): Array<string> {
  if (orientationStrings[0] === "EAST" || orientationStrings[0] === "WEST") {
    const tempOrientation = orientationStrings[0];
    orientationStrings[0] = orientationStrings[1];
    orientationStrings[1] = tempOrientation;
  }
  return orientationStrings;
};

export function usePlayerFactory() {
  return {
    requiresUpdate,
    updateMainPlayer,
    updatePartnerPlayer,
    resetPlayerData,
  };
}
