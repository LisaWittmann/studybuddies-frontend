import { Object3D, Scene, Vector3 } from "three";
import { useSceneFactory } from "@/service/scene/SceneFactory";
import { useObjectFactory } from "@/service/scene/ObjectFactory";
import { Player, MainPlayer, PartnerPlayer } from "@/service/game/Player";
import { direction, factors } from "./helper/SceneConstants";
import { Labyrinth } from "../labyrinth/Labyrinth";
import { radians } from "./helper/GeometryHelper";

const { updateCameraPosition } = useSceneFactory();
const { createPlayer, checkIntersect } = useObjectFactory();

let playerPosition: number;
let partnerPosition: number;

function requiresUpdate(player: Player) {
  if (player instanceof MainPlayer) {
    return player.getPosition() != playerPosition;
  } else if (player instanceof PartnerPlayer) {
    return player.getPosition() != partnerPosition;
  } else return false;
}

/**
 * update position of main player
 * @param player: main player
 * @param tilePosition: position of tile player should be placed on
 */
function updateMainPlayer(player: MainPlayer, tilePosition: Vector3) {
  if (requiresUpdate(player)) {
    updateCameraPosition(tilePosition);
    playerPosition = player.getPosition();
  }
}

/**
 * update position of partner players
 * @param player: partner player
 * @param tilePosition: position of tile that player should be placed in
 * @param scene: scene containing player and tile objects
 */
function updatePartnerPlayer(
  player: PartnerPlayer,
  tilePosition: Vector3,
  labyrinth: Labyrinth,
  scene: Scene
) {
  if (!player.getUsername() || !requiresUpdate(player)) {
    return;
  } else {
    const playerObject = scene.getObjectByName(player.getUsername());
    const position = calculatePartnerPositon(
      player.getPosition(),
      labyrinth,
      tilePosition
    );
    if (!partnerPosition) {
      createPlayer(player, position, scene);
    } else if (playerObject) {
      const distance = new Vector3()
        .copy(playerObject.position)
        .addScaledVector(position, -1);
      rotatePlayer(playerObject, distance);
      movePlayer(playerObject, position, player.getPosition(), scene);
    }
    partnerPosition = player.getPosition();
  }
}

function movePlayer(
  object: Object3D,
  endPosition: Vector3,
  tileKey: number,
  scene: Scene
) {
  const distance = new Vector3()
    .copy(endPosition)
    .addScaledVector(object.position, -1)
    .normalize();
  if (distance.x == 0 && distance.y == 0 && distance.z == 0) {
    object.position.copy(checkIntersect(object, tileKey, endPosition, scene));
    return;
  }
  object.position.add(distance);
  setTimeout(() => movePlayer(object, endPosition, tileKey, scene), 5);
}

function rotatePlayer(object: Object3D, difference: Vector3) {
  let rotationAngle = 0;
  if (difference.z < 0) rotationAngle = 180;
  else if (difference.x > 0) rotationAngle = -90;
  else if (difference.x < 0) rotationAngle = 90;
  object.rotation.y = radians(rotationAngle);
}

/**
 * calculating position of player in tile
 * @param currentTileID: tileID that player should be placed in
 * @param labyrinth: labyrinth object
 * @param tilePosition: vector position of tile that player should be placed in
 * @returns position as three dimensional vector
 */
function calculatePartnerPositon(
  currentTileID: number,
  labyrinth: Labyrinth,
  tilePosition: Vector3
): Vector3 {
  const tileItems = labyrinth.tileMap.get(currentTileID)?.objectsInRoom;
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
      itemOrientations.push(item.orientations.toString().replace(",", ""));
    });

    //iterates over all orientations and checks if the planned corner position is already taken by an item
    itemOrientations.forEach((o) => {
      //if there is an item in the corner -> move partner clockwise
      if (playerOrientation === o) {
        if (o === "NORTHWEST" || o === "WESTNORTH") {
          playerOrientation = "NORTHEAST";
          directionVector
            .copy(direction.north)
            .add(direction.east)
            .multiplyScalar(factors.partnerTranslateFactor);
        } else if (o === "NORTHEAST" || o === "EASTNORTH") {
          playerOrientation = "SOUTHEAST";
          directionVector
            .copy(direction.south)
            .add(direction.east)
            .multiplyScalar(factors.partnerTranslateFactor);
        } else if (o === "SOUTHEAST" || o === "EASTSOUTH") {
          playerOrientation = "SOUTHWEST";
          directionVector
            .copy(direction.south)
            .add(direction.west)
            .multiplyScalar(factors.partnerTranslateFactor);
        } else if (o === "SOUTHWEST" || o === "WESTSOUTH") {
          playerOrientation = "NORTHWEST";
          directionVector
            .copy(direction.north)
            .add(direction.west)
            .multiplyScalar(factors.partnerTranslateFactor);
        } else {
          playerOrientation = "NORTHWEST";
          directionVector
            .copy(direction.north)
            .add(direction.west)
            .multiplyScalar(factors.partnerTranslateFactor);
        }
      }
    });
  }

  console.log(
    "POSITION AFTER IF & SWITCH ",
    directionVector.x,
    directionVector.y,
    directionVector.z
  );

  calcPartnerPosition.copy(tilePosition).add(directionVector);

  console.log(
    "calcPartnerPosition ",
    calcPartnerPosition.x,
    calcPartnerPosition.y,
    calcPartnerPosition.z
  );

  return calcPartnerPosition;
}

export function usePlayerFactory() {
  return { requiresUpdate, updateMainPlayer, updatePartnerPlayer };
}
