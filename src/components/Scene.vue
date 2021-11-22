<template>
  <div id="scene"></div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted } from "vue";
import { useSceneFactory } from "@/service/SceneFactory";
import { useTileFactory } from "@/service/TileFactory";
import { vector } from "@/service/GeometryHelper";
import { useLabyrinthStore } from "@/service/LabyrinthStore"

export default defineComponent({
  name: "scene",
  setup() {
    const { createScene, renderScene, insertCanvas, updateScene } =
      useSceneFactory();
    const { createTile } = useTileFactory();

    // testing data
    const scene = createScene(vector(0, 1, 0), true);
    const tileSize = 20;
    scene.add(
      createTile({ width: tileSize, height: tileSize }, vector(0, 0, 0))
    );

    // Getting the usable labyrinthState Variable with every Tile as Object
    const {labyrinthState,updateLabyrinth} = useLabyrinthStore();
    updateLabyrinth().then(() =>
      console.log(labyrinthState.tileMap)
    )

    onMounted(() => {
      insertCanvas("scene");
      // automatically updating scene
      requestAnimationFrame(render);

      addEventListener("resize", updateScene);
      addEventListener("mousedown", onMouseDown);
      addEventListener("mouseup", onMouseUp);
    });

    onBeforeUnmount(() => {
      removeEventListener("resize", updateScene);
      removeEventListener("mousedown", onMouseDown);
      removeEventListener("mouseup", onMouseUp);
    });

    function render() {
      renderScene();
      requestAnimationFrame(render);
    }

    function onMouseDown(event: MouseEvent) {
      addEventListener("mousemove", onMouseMove);
    }

    function onMouseMove(event: MouseEvent) {
      console.log("dragging");
    }

    function onMouseUp(event: MouseEvent) {
      removeEventListener("mousemove", onMouseMove);
    }
  },
});
</script>
