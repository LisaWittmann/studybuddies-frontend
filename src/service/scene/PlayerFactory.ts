import { Object3D, Scene, Vector3 } from "three";
import { useSceneFactory } from "@/service/scene/SceneFactory";
import { useObjectFactory } from "@/service/scene/ObjectFactory";
import { PartnerPlayer } from "@/service/game/Player";

const { updateCameraPosition } = useSceneFactory();
const { createPlayer } = useObjectFactory();

let partner: Object3D | undefined;

function updateMainPlayer(tilePosition: Vector3) {
  console.log("updating player position");
  updateCameraPosition(tilePosition);
}

function updatePartnerPlayerPosition(tilePosition: Vector3) {
  console.log("updating partner position");
  const position = calculatePartnerPositon(tilePosition);
}

function initPartnerPlayer(
  player: PartnerPlayer,
  tilePosition: Vector3,
  scene: Scene
) {
  console.log("initializing partner player");
  const position = calculatePartnerPositon(tilePosition);
  partner = createPlayer(player, position);
  if (partner) scene.add(partner);
}

function calculatePartnerPositon(tilePosition: Vector3): Vector3 {
  console.log("calculating partner position");
  return tilePosition;
}
