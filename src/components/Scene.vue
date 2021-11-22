<template>
  <div id="scene"></div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted } from "vue";
import { useSceneFactory } from "@/service/SceneFactory";
import { useTileFactory } from "@/service/TileFactory";
import { vector } from "@/service/GeometryHelper";
import { useObjectLoader} from "@/service/ObjectLoader";

export default defineComponent({
  name: "scene",
  setup() {
    const { createScene, renderScene, insertCanvas, updateScene } =
      useSceneFactory();
    const { createTile } = useTileFactory();
    const { loadObject } = useObjectLoader();

    // testing data
    const scene = createScene(vector(0, 1, 0), true);
    const tileSize = 20;
    scene.add(
      createTile({ width: tileSize, height: tileSize }, vector(0, 0, 0))
    );

    // test object
    loadObject("squirrel.obj", scene, vector(0, 3, -5));
    

    



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
