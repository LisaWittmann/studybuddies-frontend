<template>
  <SceneComponent
    :labyrinth="labyrinth"
    :player="mainPlayer"
    :partner="partnerPlayer"
    @click-object="itemSelection"
    @move-player="movePlayer"
    @click-disabled="openTerminal"
  />
  <!--warning and errormessages-->
  <OverlayTerminalComponent
    :opened="showTerminal"
    :message="message"
    :state="messageState"
    @close="closeTerminal"
  />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useGameService } from "@/service/game/GameService";
import { useLoginStore } from "@/service/login/LoginStore";
import { useGameStore } from "@/service/game/GameStore";
import { useLobbyService } from "@/service/LobbyService";

import { Orientation } from "@/service/labyrinth/Tile";
import { EventMessage } from "@/service/game/EventMessage";

import SceneComponent from "@/components/SceneComponent.vue";
import OverlayTerminalComponent from "@/components/overlays/OverlayTerminalComponent.vue";

import "@/service/game/EventStore";
import router from "@/router";

export default defineComponent({
  name: "GameView",
  components: {
    SceneComponent,
    OverlayTerminalComponent,
  },
  props: {
    key: { type: String, required: true },
  },
  setup() {
    const { gameState, updateGameData, setLobbyKey } = useGameStore();
    const { playerMovement, itemSelection } = useGameService();
    const { loginState } = useLoginStore();
    const { updateUsers } = useLobbyService();
    updateGameData();

    const showTerminal = ref(false);

    onMounted(async () => {
      const route = router.currentRoute.value;
      setLobbyKey(route.params.key as string);
      await updateUsers(gameState.lobbyKey);
      updateGameData();
    });

    let mainPlayer;
    let partnerPlayer;
    gameState.playerMap.forEach((player, key) => {
      if (key == loginState.username) {
        mainPlayer = computed(() => player);
      } else {
        partnerPlayer = computed(() => player);
      }
    });

    // in-game messages like warnings, errors, hints ...
    const message =
      "Dieser Computer ist passwortgeschützt. Kein Zugriff möglich!";
    // state of message that sets text color in terminal
    // state options: neutral, warning, error
    const messageState = "warning";

    const openTerminal = () => (showTerminal.value = true);
    const closeTerminal = () => (showTerminal.value = false);

    /**
     * function which is used when clicking the arrow in Interface
     * By recieving the Orientation it creates an EventMessage as Move-Operation to send it to the BE via GameService Methode
     * @param orientation : used in the backend to identify the direction to move the player
     */
    function movePlayer(orientation: Orientation) {
      playerMovement(
        new EventMessage(
          "MOVEMENT",
          gameState.lobbyKey,
          loginState.username,
          Orientation[orientation].toString()
        )
      );
    }

    return {
      message,
      messageState,
      showTerminal,
      openTerminal,
      closeTerminal,
      itemSelection,
      movePlayer,
      mainPlayer,
      partnerPlayer,
      labyrinth: gameState.labyrinth,
    };
  },
});
</script>
