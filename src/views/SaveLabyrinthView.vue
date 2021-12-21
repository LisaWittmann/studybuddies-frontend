<template>
  <h1>Dein Labyrinth wurde gespeichert unter der ID {{ id }}</h1>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useBuildService } from "@/service/labyrinth/build/BuildService";

export default defineComponent({
  name: "SaveLabyrinthView",
  setup() {
    console.log("setting up");
    const { buildState } = useBuildService();
    const id = computed(() => buildState.id);
    return { id };
  },
});
</script>

<style lang="scss" scoped></style>
