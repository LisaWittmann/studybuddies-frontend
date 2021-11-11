<template>
  <component :is="'div'" id="scene"></component>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted } from "vue";
import { useSceneService } from "@/service/SceneService";
import { useTileService } from "@/service/TileService";
import { vector } from "@/service/GeometryHelper";

export default defineComponent({
  name: "scene",
  setup() {
    const { createScene, renderScene, insertCanvas, updateScene } =
      useSceneService();
    const { createTile } = useTileService();

    // ---- testing data
    const scene = createScene(vector(0, 1, 0), true);
    const tileSize = 20;
    scene.add(
      createTile(
        { width: tileSize, height: tileSize },
        vector(0, 0, 0),
        0x000000
      )
    );
    // ----

    onMounted(() => {
      insertCanvas("scene");
      renderScene();

      window.addEventListener("resize", updateScene);
      window.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mouseup", onMouseUp);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", updateScene);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    });

    function onMouseDown(event: MouseEvent) {
      window.addEventListener("mousemove", onMouseMove);
    }

    function onMouseMove(even: MouseEvent) {
      console.log("dragging");
    }

    function onMouseUp(event: MouseEvent) {
      window.removeEventListener("mousemove", onMouseMove);
    }
  },
});
</script>
