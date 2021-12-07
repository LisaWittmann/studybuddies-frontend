<template>
  <div id="scene"></div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, watch } from "vue";
import { useSceneFactory } from "@/service/scene/SceneFactory";
import { useLabyrinthFactory } from "@/service/scene/LabyrinthFactory";
import { MainPlayer, PartnerPlayer } from "@/service/game/Player";

export default defineComponent({
  name: "SceneComponent",
  props: {
    labyrinth: {
      type: Object,
      required: true,
    },
    mainPlayer: {
      type: MainPlayer,
      required: true,
    },
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
    const { updateLabyrinth, getTilePosition } = useLabyrinthFactory();

    const scene = createScene();
    const render = () => {
      renderScene();
      requestAnimationFrame(render);
    };

    function updatePlayer() {
      if (props.mainPlayer.position) {
        const position = getTilePosition(props.mainPlayer.position, scene);
        if (position) updateCameraPosition(position);
      }
    }

    function onMouseDown(event: MouseEvent) {
      getIntersections(
        context,
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

    watch([props.labyrinth, props.mainPlayer], () => {
      console.log("updating scene");
      updateLabyrinth(props.labyrinth, scene);
      updatePlayer();
    });
  },
});
</script>
