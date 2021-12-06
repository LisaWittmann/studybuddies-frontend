<template>
  <SceneComponent @click-object="sendItemId" />
  <!--warning and errormessages-->
  <OverlayTerminalComponent
    :opened="showTerminal"
    :message="message"
    :state="messageState"
    @close="closeTerminal"
  />
  <!--instructions for current game quest-->
  <OverlayInstructionComponent
    :opened="showInstructions"
    :instructions="instructions"
    @close="closeInstructions"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import SceneComponent from "@/components/SceneComponent.vue";
import OverlayTerminalComponent from "@/components/overlays/OverlayTerminalComponent.vue";
import OverlayInstructionComponent from "@/components/overlays/OverlayInstructionComponent.vue";

export default defineComponent({
  name: "GameView",
  components: {
    SceneComponent,
    OverlayTerminalComponent,
    OverlayInstructionComponent,
  },
  setup() {
    const showInstructions = ref(false);
    const showTerminal = ref(true);

    // instructions for current game quest e.g. finding partner player
    const instructions = [
      "Willkommen unter den Eichen",
      "Deine erste Aufgabe erwartet dich",
      "Finde zur Semester Einführungsveranstaltung",
    ];

    // in-game messages like warnings, errors, hints ...
    const message =
      "Dieser Computer ist passwortgeschützt. Kein Zugriff möglich!";
    // state of message that sets text color in terminal
    // state options: neutral, warning, error
    const messageState = "warning";

    const closeInstructions = () => (showInstructions.value = false);
    const closeTerminal = () => (showTerminal.value = false);

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

    return {
      message,
      sendItemId,
      messageState,
      instructions,
      showTerminal,
      showInstructions,
      closeTerminal,
      closeInstructions,
    };
  },
});
</script>
