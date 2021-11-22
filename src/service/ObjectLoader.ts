import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

let object = new THREE.Group();

const loader = new OBJLoader();
loader.setPath("/models/");

function loadObject(objectToLoad: string, scene: THREE.Scene) {
  loader.load(objectToLoad, function (loadedObject) {
    object = loadedObject;
    object.name = objectToLoad;
    scene.add(object);
    console.log(object);
    updateObjectPosition(new THREE.Vector3(0, 3, -5));
  });
}

function updateObjectPosition(position: THREE.Vector3) {
  object.position.set(position.x, position.y, position.z);
}

//--------------------------------
export function useObjectLoader() {
  return {
    loadObject,
  };
}
