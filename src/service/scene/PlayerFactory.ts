import { Scene, Vector3 } from "three";
import { useSceneFactory } from "@/service/scene/SceneFactory";
import { useObjectFactory } from "@/service/scene/ObjectFactory";
import { PartnerPlayer } from "@/service/game/Player";

const { updateCameraPosition } = useSceneFactory();
const { createPlayer } = useObjectFactory();

/**
 * update position of main player
 * @param tilePosition: position of tile player should be placed on
 */
function updateMainPlayer(tilePosition: Vector3) {
  console.log("updating player position");
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
  console.log("updating partner position");
  const position = calculatePartnerPositon(tilePosition);
  const playerObject = getPlayer(player.getUsername(), scene);
  if (playerObject) playerObject.position.copy(position);
  else createPlayer(player, position, scene);
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
function calculatePartnerPositon(tilePosition: Vector3): Vector3 {
  console.log("calculating partner position");
  return tilePosition;
}

export function usePlayerFactory() {
  return { updateMainPlayer, updatePartnerPlayer };
}
