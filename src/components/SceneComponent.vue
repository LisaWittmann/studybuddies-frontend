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
import { useGameStore } from "@/service/game/GameStore";
import { useAppService } from "@/service/AppService";

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
    const {
      initializeLabyrinth,
      updateLabyrinth,
      updatePlayer,
      clearLabyrinth,
    } = useLabyrinthFactory();
    const { gameState } = useGameStore();
    const { endLoading, globalState } = useAppService();

    const labyrinth = computed(() => gameState.labyrinth);

    const scene = createScene();
    setUpGame().then(() => setTimeout(() => endLoading(), 10));

    const render = () => {
      renderScene();
      requestAnimationFrame(render);
    };

    async function setUpGame() {
      await initializeLabyrinth(labyrinth.value, props.player, scene);
      await updatePlayer(props.player, labyrinth.value, scene);
      await updatePlayer(props.partner, labyrinth.value, scene);
    }

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
      clearLabyrinth(scene);
    });

    watch(
      [labyrinth, props.player, props.partner],
      () => {
        if (!globalState.loading) {
          updateLabyrinth(labyrinth.value, scene);
          updatePlayer(props.player, labyrinth.value, scene);
          updatePlayer(props.partner, labyrinth.value, scene);
        }
      },
      { deep: true }
    );

    return { onClick };
  },
});
</script>

<style lang="scss" scoped>
#scene {
  overflow: hidden;
  height: -webkit-fill-available;
  width: 100vw;
}
</style>
