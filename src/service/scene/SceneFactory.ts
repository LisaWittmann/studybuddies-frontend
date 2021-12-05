import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Orientation } from "@/service/Tile";
import { Vector3 } from "three";
import { settings, direction } from "@/service/scene/helper/SceneConstants";
import { EmitsOptions, SetupContext } from "vue";

let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let raycaster: THREE.Raycaster;

let camera: THREE.PerspectiveCamera;
let orbitControls: OrbitControls;

/**
 * creates new threejs 3D scene
 * @param cameraPosition: position of camera / player in scene
 * @param debug: activates grid helper
 * @returns initialized scene with simple lightning
 */
function createScene(
  cameraPosition: THREE.Vector3,
  debug = false
): THREE.Scene {
  //RENDERER-----------------
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  //RAYCASTER----------------
  raycaster = new THREE.Raycaster();
  raycaster.far = settings.tileSize;

  //CAMERA-------------------
  const ratio = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, ratio, 0.1, 1000);
  updateCameraPosition(cameraPosition, Orientation.NORTH);

  //SCENE--------------------
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x696969);

  //CONTROLS-----------------
  orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enableZoom = false;
  orbitControls.enablePan = false;
  orbitControls.update();
  updateCameraTarget(Orientation.NORTH);
  orbitControls.addEventListener("end", () => {
    updateCameraOrbit();
  });
  updateCameraOrbit();

  //GRID---------------------
  if (debug) {
    const grid = new THREE.GridHelper(100, 100, 0xffffff, 0xffffff);
    scene.add(grid);
  }

  //LIGHT--------------------
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  return scene;
}

function renderScene() {
  renderer.render(scene, camera);
  orbitControls.update();
}

/**
 * adds canvas element with rendered scene to DOM tree
 * @param container: optional ID od element, that should contain scene
 */
function insertCanvas(container: string | null) {
  if (container) {
    document.getElementById(container)?.appendChild(renderer.domElement);
  } else {
    document.body.appendChild(renderer.domElement);
  }
}

/**
 * updates camera / player position
 * @param position: new camera position
 */
function updateCameraPosition(
  position: THREE.Vector3,
  orientation?: Orientation
) {
  camera.position.set(
    position.x,
    position.y + settings.cameraHeight,
    position.z
  );
  if (orientation) updateCameraTarget(orientation);
}

function updateCameraTarget(orientation: Orientation) {
  const target = new Vector3().copy(camera.position);
  switch (orientation) {
    case Orientation.NORTH:
      orbitControls.target = target.add(direction.north);
      break;
    case Orientation.EAST:
      orbitControls.target = target.add(direction.east);
      break;
    case Orientation.SOUTH:
      orbitControls.target = target.add(direction.south);
      break;
    case Orientation.WEST:
      orbitControls.target = target.add(direction.west);
      break;
  }
}

/**
 * updates camera orbit/rotation
 */
function updateCameraOrbit() {
  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward);
  orbitControls.target.copy(camera.position).add(forward);
  updateObjectsInView();
}

/**
 * gets intersecting object of converted cursor position
 * @param context: context of delegating component to emit changes
 * @param x: converted x position of cursor
 * @param y: converted y position of cursor
 */
function getIntersections(
  context: SetupContext<EmitsOptions>,
  x: number,
  y: number
) {
  raycaster.setFromCamera({ x: x, y: y }, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  // testing intersections
  for (const intersection of intersects) {
    const object = intersection.object;
    // if parent object is a 'valid' object (no tile)
    if (object.parent?.userData.id != null) {
      context.emit("click-object", object.parent.userData.id);
    } else if (object.parent?.userData.showInView) {
      context.emit("move-player", object.parent.userData.orientation);
    }
  }
}

/**
 * get all scene objects that are faced by camera in interaction radius
 * and update visibility of scene objects that should only be visible in view
 */
function updateObjectsInView() {
  camera.updateMatrix();
  camera.updateMatrixWorld();
  const frustum = new THREE.Frustum();
  frustum.setFromProjectionMatrix(
    new THREE.Matrix4().multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    )
  );

  scene.traverse((object) => {
    if (object.userData.showInView) {
      object.visible =
        isInInteractionRadius(object.position) &&
        frustum.containsPoint(object.position);
    }
  });
}

/**
 * check if object is in interaction radius
 * @param position: position of object
 */
function isInInteractionRadius(position: THREE.Vector3) {
  const radius = settings.tileSize / 2;
  return (
    Math.abs(position.x - Math.floor(camera.position.x)) < radius &&
    Math.abs(position.z - Math.floor(camera.position.z)) < radius
  );
}

/**
 * updates scene based on screen size
 */
function updateScene() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

//-------------------------------------------
export function useSceneFactory() {
  return {
    createScene,
    renderScene,
    insertCanvas,
    updateScene,
    updateCameraPosition,
    getIntersections,
  };
}
