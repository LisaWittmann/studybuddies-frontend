<template>
  <div id="scene" @click="onClick"></div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, watch } from "vue";
import { useSceneFactory } from "@/service/scene/SceneFactory";
import { useLabyrinthFactory } from "@/service/scene/LabyrinthFactory";
import { MainPlayer } from "@/service/game/Player";

export default defineComponent({
  name: "SceneComponent",
  props: {
    labyrinth: {
      type: Object,
      required: true,
    },
    player: {
      type: MainPlayer,
      required: true,
    },
    partner: {
      type: PartnerPlayer,
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
    } = useSceneFactory();
    const { updateLabyrinth, updatePlayer } = useLabyrinthFactory();

    const scene = createScene();
    const render = () => {
      renderScene();
      requestAnimationFrame(render);
    };

    function onClick(event: MouseEvent) {
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
    });

    onBeforeUnmount(() => {
      removeEventListener("resize", updateScene);
    });

    watch([props.labyrinth, props.player, props.partner], () => {
      console.log("updating scene");
      updateLabyrinth(props.labyrinth, scene);
      updatePlayer(props.player, scene);
      updatePlayer(props.partner, scene);
    });

    return { onClick };
  },
});
</script>
