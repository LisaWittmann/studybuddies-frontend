<template>
  <div id="scene"></div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, watch } from "vue";
import { useSceneFactory } from "@/service/scene/SceneFactory";
import { useLabyrinthFactory } from "@/service/scene/LabyrinthFactory";
import { useLabyrinthStore } from "@/service/LabyrinthStore";
import { vector } from "@/service/scene/helper/GeometryHelper";
import { activePlayer } from "@/service/Player";
import { Vector3 } from "three";

export default defineComponent({
  name: "SceneComponent",
  props: {
    mainPlayer: activePlayer,
  },
  setup(props, context) {
    const {
      createScene,
      renderScene,
      insertCanvas,
      updateScene,
      getIntersections,
      updateCameraPosition,
    } = useSceneFactory();
    const { createLabyrinth } = useLabyrinthFactory();

    // testing data
    const scene = createScene(vector(0, 0, 0));
    const { labyrinthState, updateLabyrinth } = useLabyrinthStore();
    // - ob tile schon existent
    // - player automatisch auf position
    updateLabyrinth().then(() =>
      createLabyrinth(
        labyrinthState.tileMap,
        labyrinthState.playerStartTileIds,
        scene
      )
    );


    /**
     * get tile position by in scene by tile id
     * @returns position in scene or undefined if tile is not in scene
     */
    function getTilePosition(id: number | undefined): Vector3 | undefined {
      let position = undefined;
      scene.traverse((child) => {
        if (child.userData.tileId == id) {
          position = child.position;
        }
      });
      return position;
    }

    function updatePlayer() {
      const position = getTilePosition(props.mainPlayer?.position);
      if (position) updateCameraPosition(position);
    }

    function render() {
      renderScene();
      requestAnimationFrame(render);
    }

    function onMouseDown(event: MouseEvent) {
      getIntersections(
        context,
        (event.clientX / innerWidth) * 2 - 1,
        -(event.clientY / innerHeight) * 2 + 1
      );
    }

    watch([props.mainPlayer], ([mainPlayer]) => {
      updatePlayer();
    });

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
