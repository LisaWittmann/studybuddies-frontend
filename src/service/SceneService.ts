import * as THREE from "three";

let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let camera: THREE.PerspectiveCamera;

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
  const ratio = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(90, ratio, 0.1, 1000);
  updateCameraPosition(cameraPosition);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x696969);

  // grid helper for debugging
  if (debug) {
    const grid = new THREE.GridHelper(50, 50, 0xffffff, 0xffffff);
    scene.add(grid);
  }

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  return scene;
}

function renderScene() {
  renderer.render(scene, camera);
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
 * updates scene based on screen size
 */
function updateScene() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderScene();
}

/**
 * updates camera / player position
 * @param position: new camera position
 */
function updateCameraPosition(position: THREE.Vector3) {
  camera.position.set(position.x, position.y, position.z);
}

export function useSceneService() {
  return {
    createScene,
    renderScene,
    insertCanvas,
    updateScene,
    updateCameraPosition,
  };
}
