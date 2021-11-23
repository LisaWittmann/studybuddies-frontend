<template>
  <LobbyComponent />
  <Instructions v-if="showInstructions" :instructions="instructions" />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import LobbyComponent from "@/components/LobbyComponent.vue";
import Instructions from "@/components/Instructions.vue";

export default defineComponent({
  name: "Lobby",
  components: { LobbyComponent, Instructions },
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
