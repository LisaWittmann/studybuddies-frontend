import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { tileSize } from "@/service/scene/helper/Constants";

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
  raycaster.far = tileSize;

  //CAMERA-------------------
  const ratio = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, ratio, 0.1, 1000);
  updateCameraPosition(cameraPosition);

  //SCENE--------------------
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x696969);

  //CONTROLS-----------------
  orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.target = cameraPosition;
  orbitControls.enableZoom = false;
  orbitControls.enablePan = false;
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
function updateCameraPosition(position: THREE.Vector3) {
  camera.position.set(position.x, position.y, position.z);
}

/**
 * updates camera orbit/rotation
 */
function updateCameraOrbit() {
  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward);
  orbitControls.target.copy(camera.position).add(forward);
}

/**
 * gets intersecting object of converted cursor position
 * @param x: converted x position of cursor
 * @param y: converted y position of cursor
 */
function getIntersections(x: number, y: number) {
  raycaster.setFromCamera({ x: x, y: y }, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  // testing intersections
  for (const i of intersects) {
    if (i.object.type == "Mesh") {
      const object = i.object as THREE.Mesh;
      if (i.object.userData.clickable) handleClick(object);
    }
  }
}

function handleClick(object: THREE.Mesh): void {
  const material = object.material as THREE.Material;
  material.opacity = material.opacity == 1 ? 0.6 : 1;
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
