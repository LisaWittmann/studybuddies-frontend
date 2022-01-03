import { Scene, Vector3 } from "three";
import { useSceneFactory } from "@/service/scene/SceneFactory";
import { useObjectFactory } from "@/service/scene/ObjectFactory";
import { PartnerPlayer } from "@/service/game/Player";
import { settings, direction } from "./helper/SceneConstants";
import { useLabyrinthStore } from "../labyrinth/LabyrinthStore";
import { Orientation, Tile } from "../labyrinth/Tile";
import { Item } from "../labyrinth/Item";

const { updateCameraPosition } = useSceneFactory();
const { createPlayer } = useObjectFactory();

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
    const playerObject = getPlayer(player.getUsername(), scene);
    const position = calculatePartnerPositon(
      player.getPosition(),
      tilePosition
    );
    if (!partnerInitialized) {
      partnerInitialized = true;
      createPlayer(player, position, scene);
    } else if (playerObject) {
      console.log("PLAYER EXISTS!!!!!!!!!!!!!!!!!!!!!!!!")
      playerObject.position.copy(position);
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

  //partner initially placed in the northwest corner
  let playerOrientation = "NORTHWEST";
  let calcPartnerPosition = new Vector3();
  calcPartnerPosition
    .copy(tilePosition)
    .add(direction.north)
    .add(direction.west);

  //gets all orientations/positions of items in tile
  if (tileItems) {
    tileItems.forEach((item) => {
      itemOrientations.push(item.orientations.toString().replace(",", ""));
    });
  }

  //iterates over all orientations and checks if the planned corner position is already taken by an item
  itemOrientations.forEach((o) => {
    //if there is an item in the corner -> move partner clockwise
    if (playerOrientation === o) {
      switch (o) {
        case "NORTHWEST" || "WESTNORTH":
          playerOrientation = "NORTHEAST";
          calcPartnerPosition
            .copy(tilePosition)
            .add(direction.north)
            .add(direction.east);
          break;
        case "NORTHEAST" || "EASTNORTH":
          playerOrientation = "SOUTHEAST";
          calcPartnerPosition
            .copy(tilePosition)
            .add(direction.south)
            .add(direction.east);
          break;
        case "SOUTHEAST" || "EASTSOUTH":
          playerOrientation = "SOUTHWEST";
          calcPartnerPosition
            .copy(tilePosition)
            .add(direction.south)
            .add(direction.west);
          break;
        case "SOUTHWEST" || "WESTSOUTH":
          playerOrientation = "NORTHWEST";
          calcPartnerPosition
            .copy(tilePosition)
            .add(direction.north)
            .add(direction.west);
          break;
      }
    }
  });

  //move partner quarter of the current tile size to be in same radius as items
  calcPartnerPosition = calcPartnerPosition.multiplyScalar(
    settings.tileSize / 4
  );

  console.log(calcPartnerPosition);
  return calcPartnerPosition;
}



export function usePlayerFactory() {
  return { updateMainPlayer, updatePartnerPlayer };
}
