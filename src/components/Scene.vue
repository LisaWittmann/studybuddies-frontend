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
import { useObjectFactory } from "@/service/scene/ObjectFactory";
import { useLabyrinthStore } from "@/service/LabyrinthStore";
import { Cube } from "@/service/Shape";
import { vector } from "@/service/scene/helper/GeometryHelper";

export default defineComponent({
  name: "scene",
  setup() {
    const {
      createScene,
      renderScene,
      insertCanvas,
      updateScene,
      getIntersections,
    } = useSceneFactory();
    const { createTile } = useTileFactory();
    const { createObject } = useObjectFactory();

    // testing data
    const scene = createScene(vector(0, 2, 0), true);
    const tileSize = 20;
    scene.add(
      createTile({ width: tileSize, height: tileSize }, vector(0, 0, 0))
    );
    scene.add(createObject(new Cube(2), vector(0, 0, -5)));

    // Getting the usable labyrinthState Variable with every Tile as Object
    const { labyrinthState, updateLabyrinth } = useLabyrinthStore();
    updateLabyrinth().then(() => console.log(labyrinthState.tileMap));

    function render() {
      renderScene();
      requestAnimationFrame(render);
    }

    function onMouseDown(event: MouseEvent) {
      getIntersections(
        (event.clientX / innerWidth) * 2 - 1,
        (event.clientY / innerHeight) * 2 - 1
      );
    }

    onMounted(() => {
      insertCanvas("scene");
      requestAnimationFrame(render);

      window.addEventListener("resize", updateScene);
      window.addEventListener("mousedown", onMouseDown);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", updateScene);
    });
  },
});
</script>
