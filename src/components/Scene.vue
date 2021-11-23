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
import { useLabyrinthFactory } from "@/service/scene/LabyrinthFactory";
import { useLabyrinthStore } from "@/service/LabyrinthStore";
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
    const { createLabyrinth } = useLabyrinthFactory();

    // testing data
    const scene = createScene(vector(0, 2, 0), true);
    const { labyrinthState, updateLabyrinth } = useLabyrinthStore();
    updateLabyrinth().then(() => createLabyrinth(labyrinthState, scene));

    function render() {
      renderScene();
      requestAnimationFrame(render);
    }

    function onMouseDown(event: MouseEvent) {
      getIntersections(
        (event.clientX / innerWidth) * 2 - 1,
        -(event.clientY / innerHeight) * 2 + 1
      );
    }

    onMounted(() => {
      insertCanvas("scene");
      requestAnimationFrame(render);

      addEventListener("resize", updateScene);
      addEventListener("mousedown", onMouseDown);
    });

    onBeforeUnmount(() => {
      removeEventListener("resize", updateScene);
      removeEventListener("mousedown", onMouseDown);
    });
  },
});
</script>
