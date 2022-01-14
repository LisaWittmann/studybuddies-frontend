<template>
  <div id="scene" @click="onClick"></div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  watch,
} from "vue";
import { useSceneFactory } from "@/service/scene/SceneFactory";
import { useLabyrinthFactory } from "@/service/scene/LabyrinthFactory";
import { MainPlayer, PartnerPlayer } from "@/service/game/Player";
import { Labyrinth } from "@/service/labyrinth/Labyrinth";
import { useGameStore } from "@/service/game/GameStore";

export default defineComponent({
  name: "SceneComponent",
  props: {
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
    const { initializeLabyrinth, updateLabyrinth, updatePlayer } =
      useLabyrinthFactory();
    const { gameState } = useGameStore();

    const labyrinth = computed(() => gameState.labyrinth);

    const scene = createScene();
    initializeLabyrinth(labyrinth.value, props.player, scene);

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

    watch(
      [labyrinth, props.player, props.partner],
      () => {
        console.log("watcher triggered");
        updateLabyrinth(labyrinth.value, scene);
        updatePlayer(props.player, labyrinth.value, scene);
        updatePlayer(props.partner, labyrinth.value, scene);
      },
      { deep: true }
    );

    return { onClick };
  },
});
</script>
