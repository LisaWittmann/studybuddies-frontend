<template>
  <SceneComponent />
  <InstructionComponent v-if="showInstructions" :instructions="instructions" />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import SceneComponent from "@/components/SceneComponent.vue";
import InstructionComponent from "@/components/InstructionComponent.vue";
import { useGameStore } from "@/service/GameStore"

export default defineComponent({
  name: "GameView",
  components: { SceneComponent, InstructionComponent },
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
