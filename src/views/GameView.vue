<template>
  <SceneComponent @click-object="sendItemId" :mainPlayer="" />
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

    const { gameState, updateGame } = useGameStore();
    const mainPlayer = gameState.playerMap.get();

    // test data
    const instructions = [
      "Willkommen unter den Eichen",
      "Deine erste Aufgabe erwartet dich",
      "Finde zur Semester Einführungsveranstaltung",
    ];

    // send the clicked item id to backend
    async function sendItemId(itemId: number): Promise<void> {
      try {
        await fetch("/api/click/" + itemId, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(itemId),
        });
      } catch (reason) {
        console.error(`Fehler: ${reason}`);
      }
    }
    return { instructions, showInstructions, sendItemId, gameState};
  },
});
</script>
