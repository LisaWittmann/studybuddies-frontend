<template>
  <SceneComponent
    :mainPlayer="mainPlayer"
    @click-object="sendItemId"
    @move-player="movePlayer"
  />
  <InstructionComponent v-if="showInstructions" :instructions="instructions" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import SceneComponent from "@/components/SceneComponent.vue";
import InstructionComponent from "@/components/InstructionComponent.vue";
import { useGameStore } from "@/service/GameStore";
import { Orientation } from "@/service/Tile";
import { activePlayer } from "@/service/Player";
import { useMoveOperation } from "@/service/MoveService";
import { MoveOperation, Operation } from "@/service/EventMessage";
import "@/service/EventStore";

export default defineComponent({
  name: "GameView",
  components: { SceneComponent, InstructionComponent },
  setup() {
    // activate to test instructions
    const showInstructions = ref(false);

    const { gameState, updateGame } = useGameStore();
    console.log(gameState);
    const mainPlayer = gameState.playerMap.get("TestUser");
    const { sendMove } = useMoveOperation();

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

    function movePlayer(orientation: Orientation) {
      sendMove(
        new MoveOperation(
          "MOVEMENT",
          "lobbykey",
          (mainPlayer as activePlayer).username,
          Orientation[orientation].toString()
        )
      );
      console.log("move player to", orientation);
    }

    return {
      instructions,
      showInstructions,
      sendItemId,
      movePlayer,
      mainPlayer,
    };
  },
});
</script>
