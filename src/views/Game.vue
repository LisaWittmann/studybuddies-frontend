<template>
  <Scene />
  <!--Instructions v-if="showInstructions" :instructions="instructions" /-->
  <Overlay :opened="showInstructions">
    <Terminal />
  </Overlay>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Scene from "@/components/Scene.vue";
//import Instructions from "@/components/Instructions.vue";
import Overlay from "@/components/Overlay.vue";
import Terminal from "@/components/Terminal.vue";

export default defineComponent({
  name: "Game",
  components: { Scene, Overlay, Terminal },
  setup() {
    // activate to test instructions
    const showInstructions = ref(true);

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

