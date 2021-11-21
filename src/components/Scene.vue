<template>
  <div id="scene"></div>
  <!-- displaying camera position + lookAt for development-->
  <div id="camera-vectors" style="position: absolute; top: 0; right: 0; background: grey; padding: 8px; color: white;">
    <span>Free Camera Vectors:</span><br>
    <span id="position"></span><br>
    <span id="lookingAt"></span>
  </div>
  <!-------------------------------------------------------->
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted } from "vue";
import { useSceneFactory } from "@/service/SceneFactory";
import { useTileFactory } from "@/service/TileFactory";
import { vector } from "@/service/GeometryHelper";

export default defineComponent({
  name: "scene",
  setup() {
    const {
      createScene,
      renderScene,
      insertCanvas,
      updateScene,
      updateCameraPosition
    } = useSceneFactory();
    const { createTile } = useTileFactory();

    //mousemovement
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    // testing data
    const scene = createScene(vector(0, 2, 0), true);
    const tileSize = 20;
    scene.add(
      createTile({ width: tileSize, height: tileSize }, vector(0, 0, 0))
    );

    onMounted(() => {
      insertCanvas("scene");
      requestAnimationFrame(render);

      window.addEventListener("resize", updateScene);
      window.addEventListener("mousedown", onMouseDown, false);
      window.addEventListener("mousemove", onMouseMove, false);
      window.addEventListener("mouseup", onMouseUp, false);
    });

    function render() {
      renderScene();
      requestAnimationFrame(render);
    }

    //EventListeners-----
    function onMouseDown(event: MouseEvent) {
      //window.addEventListener("mousedown", onMouseDown);
      console.log("mouse down", event.x, event.pageY);
      startX = event.x;
      startY = event.y;
      isDragging = true;
    }

    function onMouseMove(event: MouseEvent) {
      //window.addEventListener("mousemove", onMouseMove);
      if (isDragging === true) {
        console.log("mousemove", event.clientX, event.clientY);
      }
    }

    function onMouseUp(event: MouseEvent) {
      //window.removeEventListener("mouseup", onMouseDown);
      console.log("mouse up", event.x, event.pageY);
      isDragging = false;
    }

    onBeforeUnmount(() => {
      window.removeEventListener("resize", updateScene);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
    });
  },
});
</script>
