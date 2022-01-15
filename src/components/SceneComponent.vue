<template>
  <div id="scene" @click="onClick"></div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, watch } from "vue";
import { useSceneFactory } from "@/service/scene/SceneFactory";
import { useLabyrinthFactory } from "@/service/scene/LabyrinthFactory";
import { MainPlayer, PartnerPlayer } from "@/service/game/Player";
import { Labyrinth } from "@/service/labyrinth/Labyrinth";

export default defineComponent({
  name: "SceneComponent",
  props: {
    labyrinth: {
      type: Labyrinth,
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
    const { initializeLabyrinth, updateLabyrinth, updatePlayer } =
      useLabyrinthFactory();

    const scene = createScene();
    initializeLabyrinth(props.labyrinth, props.player, scene);

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
      [props.labyrinth, props.player, props.partner],
      () => {
        updateLabyrinth(props.labyrinth, scene);
        updatePlayer(props.player, props.labyrinth, scene);
        updatePlayer(props.partner, props.labyrinth, scene);
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
