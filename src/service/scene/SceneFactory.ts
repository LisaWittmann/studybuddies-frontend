import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { SetupContext } from "vue";
import { Orientation } from "@/service/labyrinth/Tile";
import { settings, directionMap } from "@/service/scene/helper/SceneConstants";

let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let rayCaster: THREE.Raycaster;

let camera: THREE.PerspectiveCamera;
let orbitControls: OrbitControls;

/**
 * creates new Three js 3D scene
 * @param debug: activates grid helper
 * @returns initialized scene
 */
function createScene(debug = false): THREE.Scene {
  //RENDERER-----------------
  const pixelRatio = window.devicePixelRatio;
  const antialias = pixelRatio < 1;

  renderer = new THREE.WebGLRenderer({
    antialias: antialias,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  //RAY_CASTER----------------
  rayCaster = new THREE.Raycaster();
  rayCaster.far = getInteractionRadius();

  //CAMERA-------------------
  const ratio = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, ratio, 0.1, 1000);
  camera.position.set(0, settings.cameraHeight, 0);

  //SCENE--------------------
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x696969);

  //CONTROLS-----------------
  orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enableZoom = false;
  orbitControls.enablePan = false;
  orbitControls.target = new THREE.Vector3().copy(camera.position);
  orbitControls.update();
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

/**
 * render function for animation loop
 */
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
 * @param position new camera position
 * @param orientation contains new camera orientation
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
  else updateCameraOrbit();
}

/**
 * turn camera in given orientation
 * @param orientation: orientation in which camera should look
 */
function updateCameraTarget(orientation: Orientation) {
  const direction = directionMap.get(orientation);
  if (direction) {
    orbitControls.target = new THREE.Vector3()
      .copy(camera.position)
      .add(direction);
    orbitControls.update();
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
function getIntersection(context: SetupContext, x: number, y: number) {
  rayCaster.setFromCamera({ x: x, y: y }, camera);
  const intersects = rayCaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    const object = intersects[0].object;
    if (object.parent?.name.includes("item")) {
      context.emit(
        "click-object",
        object.parent.userData.modelName,
        object.parent.userData.id
      );
    } else if (object.parent?.name.includes("arrow")) {
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
 * calculates interaction radius by pythagorean theorem based on tileSize and cameraheight
 * @returns interaction radius
 */
function getInteractionRadius(): number {
  return Math.ceil(
    Math.sqrt(
      Math.pow(settings.tileSize / 2, 2) + Math.pow(settings.cameraHeight, 2)
    )
  );
}

/**
 * check if object is in interaction radius
 * @param position: position of object
 */
function isInInteractionRadius(position: THREE.Vector3) {
  return (
    Math.abs(position.x - Math.floor(camera.position.x)) <
      getInteractionRadius() &&
    Math.abs(position.z - Math.floor(camera.position.z)) <
      getInteractionRadius()
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
    updateCameraTarget,
    getIntersection,
  };
}
