import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

//single object, that will be filled with the loaded data
let object = new THREE.Group();

//OBJLoader loader from THREE.js to load .obj
const loader = new OBJLoader();
/**
 * path hast to be public to be accessible by vue
 * @todo where to save all models -> needs to be talked about
 */
loader.setPath("/models/");

/**
 * gets the obj-filename of the object as String
 * and adds the object (THREE.Group) to the scene
 * updates the possition of the loaded object according to the passed data
 * @param objectToLoad
 * @param scene
 * @param objectPosition
 */
function loadObject(
  objectToLoad: string,
  scene: THREE.Scene,
  objectPosition: THREE.Vector3
) {
  loader.load(objectToLoad, function (loadedObject) {
    object = loadedObject;
    object.name = objectToLoad;
    scene.add(object);
    updateObjectPosition(objectPosition);
  });
}

/**
 * updates the possition of the loaded object according to the passed data
 * @param position
 */
function updateObjectPosition(position: THREE.Vector3) {
  object.position.set(position.x, position.y, position.z);
}

//--------------------------------
export function useObjectLoader() {
  return {
    loadObject,
  };
}
