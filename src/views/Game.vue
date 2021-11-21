<template>
  <Scene />
  <Instructions v-if="showInstructions" :instructions="instructions" />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Scene from "@/components/Scene.vue";
import Instructions from "@/components/Instructions.vue";

export default defineComponent({
  name: "Game",
  components: { Scene, Instructions },
  setup() {
    // activate to test instructions
    const showInstructions = ref(false);

    // test data
    const instructions = [
      "Willkommen unter den Eichen",
      "Deine erste Aufgabe erwartet dich",
      "Finde zur Semester Einführungsveranstaltung",
    ];
    return { instructions, showInstructions };
  },
});
</script>
