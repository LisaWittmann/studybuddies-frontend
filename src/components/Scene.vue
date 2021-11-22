<template>
  <div id="scene"></div>
  <!-- displaying camera position + lookAt for development-->
  <div
    id="camera-vectors"
    style="
      position: absolute;
      top: 0;
      right: 0;
      background: grey;
      padding: 8px;
      color: white;
    "
  >
    <span>Free Camera Vectors:</span><br />
    <span id="position"></span><br />
    <span id="lookingAt"></span>
  </div>
  <!-------------------------------------------------------->
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted } from "vue";
import { useSceneFactory } from "@/service/scene/SceneFactory";
import { useTileFactory } from "@/service/scene/TileFactory";
import { useObjectLoader } from "@/service/scene/helper/ObjectLoader";
import { useLabyrinthStore } from "@/service/LabyrinthStore";
import { vector } from "@/service/scene/helper/GeometryHelper";

export default defineComponent({
  name: "scene",
  setup() {
    const { createScene, renderScene, insertCanvas, updateScene } =
      useSceneFactory();
    const { createTile } = useTileFactory();
    const { loadObject } = useObjectLoader();

    // testing data
    const scene = createScene(vector(0, 2, 0), true);
    const tileSize = 20;
    scene.add(
      createTile({ width: tileSize, height: tileSize }, vector(0, 0, 0))
    );

    // Getting the usable labyrinthState Variable with every Tile as Object
    const { labyrinthState, updateLabyrinth } = useLabyrinthStore();
    updateLabyrinth().then(() => console.log(labyrinthState.tileMap));

    // test object
    loadObject("navigation-arrow.obj", scene, vector(0, 0, -9));

    function render() {
      renderScene();
      requestAnimationFrame(render);
    }

    onMounted(() => {
      insertCanvas("scene");
      requestAnimationFrame(render);

      window.addEventListener("resize", updateScene);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", updateScene);
    });
  },
});
</script>
