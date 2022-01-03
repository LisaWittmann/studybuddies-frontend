import { Scene, Vector3 } from "three";
import { useSceneFactory } from "@/service/scene/SceneFactory";
import { useObjectFactory } from "@/service/scene/ObjectFactory";
import { PartnerPlayer } from "@/service/game/Player";
import { settings, direction } from "./helper/SceneConstants";
import { useLabyrinthStore } from "../labyrinth/LabyrinthStore";
import { Orientation, Tile } from "../labyrinth/Tile";
import { Item, Position } from "../labyrinth/Item";

const { updateCameraPosition } = useSceneFactory();
const { createPlayer, checkIntersect } = useObjectFactory();

let partnerInitialized = false;
const { labyrinthState } = useLabyrinthStore();
/**
 * update position of main player
 * @param tilePosition: position of tile player should be placed on
 */
function updateMainPlayer(tilePosition: Vector3) {
  console.log("updating player position ");
  updateCameraPosition(tilePosition);
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
  scene: Scene
) {
  if (player.getUsername() == "") {
    return;
  } else {
    const playerObject = <THREE.Group>getPlayer(player.getUsername(), scene);
    console.log("TILE Position", tilePosition);

    const position = calculatePartnerPositon(
      player.getPosition(),
      tilePosition
    );
    if (!partnerInitialized) {
      partnerInitialized = true;
      createPlayer(player, position, scene);
    } else if (playerObject) {
      console.log("PLAYER EXISTS!!!!!!!!!!!!!!!!!!!!!!!!", position);
      playerObject.position.copy(position);
      playerObject.position.copy(
        checkIntersect(playerObject, player, position, scene)
      );
    }
  }
}

/**
 * get player representation by username from scene
 * @param username: username of the wanted player
 * @param scene: scene to search username in
 * @returns player object or undefined
 */
function getPlayer(
  username: string,
  scene: THREE.Scene
): THREE.Object3D | undefined {
  let player = undefined;
  scene.traverse((child) => {
    if (child.userData.username == username) player = child;
  });
  return player;
}

/**
 * calculating position of player in tile
 * @param tilePosition: position of tile that player should be placed in
 * @returns position as three dimensional vector
 */
function calculatePartnerPositon(
  currentTileID: number,
  tilePosition: Vector3
): Vector3 {
  const tileItems = labyrinthState.tileMap.get(currentTileID)?.objectsInRoom;
  const itemOrientations = new Array<string>();
  const factor = settings.tileSize / 4;

  //partner initially placed in the northwest corner
  let playerOrientation = "NORTHWEST";
  const calcPartnerPosition = new Vector3();
  const directionVector = new Vector3();

  console.log("TILE POS:", tilePosition);

  //gets all orientations/positions of items in tile
  if (tileItems && tileItems?.length > 1) {
    tileItems.forEach((item) => {
      itemOrientations.push(item.orientations.toString().replace(",", ""));
    });

    //iterates over all orientations and checks if the planned corner position is already taken by an item
    itemOrientations.forEach((o) => {
      console.log("ORIENTATIONS", o);
      //if there is an item in the corner -> move partner clockwise
      console.log("PLAYER ORIENTATION", playerOrientation);

      if (playerOrientation === o) {
        switch (o) {
          case "NORTHWEST" || "WESTNORTH":
            playerOrientation = "NORTHEAST";
            directionVector
              .copy(direction.north)
              .add(direction.east)
              .multiplyScalar(factor);
            break;
          case "NORTHEAST" || "EASTNORTH":
            playerOrientation = "SOUTHEAST";
            directionVector
              .copy(direction.south)
              .add(direction.east)
              .multiplyScalar(factor);
            break;
          case "SOUTHEAST" || "EASTSOUTH":
            playerOrientation = "SOUTHWEST";
            directionVector
              .copy(direction.south)
              .add(direction.west)
              .multiplyScalar(factor);
            break;
          case "SOUTHWEST" || "WESTSOUTH":
            playerOrientation = "NORTHWEST";
            directionVector
              .copy(direction.north)
              .add(direction.west)
              .multiplyScalar(factor);
            break;
          default:
            playerOrientation = "NORTHWEST";
            directionVector
              .copy(direction.north)
              .add(direction.west)
              .multiplyScalar(factor);
            break;
        }
      }

      console.log("NO MORE ITEMS");
    });
  } else {
    playerOrientation = "NORTHWEST";
    directionVector
      .copy(direction.north)
      .add(direction.west)
      .multiplyScalar(factor);
  }

  console.log("CALCULATED PARTNER POS BEFORE", calcPartnerPosition);

  console.log("TILE POS AFTER:", tilePosition, directionVector);

  calcPartnerPosition.copy(tilePosition).add(directionVector);

  //move partner quarter of the current tile size to be in same radius as items
  /* calcPartnerPosition = calcPartnerPosition.multiplyScalar(
    settings.tileSize / 4
  ); */
  console.log("CALCULATED PARTNER POS AFTER", calcPartnerPosition);

  return calcPartnerPosition;
}

export function usePlayerFactory() {
  return { updateMainPlayer, updatePartnerPlayer };
}
