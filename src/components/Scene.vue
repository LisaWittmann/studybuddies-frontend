<template>
  <component :is="'div'" id="scene"></component>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted } from "vue";
import { useSceneService } from "@/service/SceneService";
import { Vector3 } from "three";

export default defineComponent({
  name: "scene",
  setup() {
    const { createScene, renderScene, insertCanvas, updateScene } =
      useSceneService();

    // ---- testing data
    const player = new Vector3(0, 1, 10);
    const scene = createScene(player, true);
    // ---- testing data end

    onMounted(() => {
      insertCanvas("scene");
      renderScene();

      window.addEventListener("resize", updateScene);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", updateScene);
    });
  },
});
</script>
