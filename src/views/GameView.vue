<template>
  <SceneComponent
    :labyrinth="labyrinth"
    :player="mainPlayer"
    :partner="partnerPlayer"
    @click-object="clickItem"
    @move-player="movePlayer"
    @click-disabled="toggleEventMessage"
  />
  <!--warning and error messages-->
  <OverlayTerminalComponent
    :opened="gameEventMessage.visible"
    :message="gameEventMessage.message"
    :state="gameEventMessage.state"
    @close="toggleEventMessage"
  />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";
import { useGameService } from "@/service/game/GameService";
import { useLoginStore } from "@/service/login/LoginStore";
import { useGameStore } from "@/service/game/GameStore";

import { Orientation } from "@/service/labyrinth/Tile";
import { EventMessage } from "@/service/game/EventMessage";

import SceneComponent from "@/components/SceneComponent.vue";
import OverlayTerminalComponent from "@/components/overlays/OverlayTerminalComponent.vue";

import "@/service/game/EventStore";
import { useLobbyService } from "@/service/LobbyService";
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
    const { loginState } = useLoginStore();
    const { updateUsers } = useLobbyService();
    const { gameState, updateGameData, setLobbyKey } = useGameStore();
    const { gameEventMessage, toggleEventMessage, playerMovement, clickItem } =
      useGameService();
    updateGameData();

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

    /**
     * function which is used when clicking the arrow in Interface
     * By receiving the Orientation it creates an EventMessage as Move-Operation to send it to the BE via GameService Methode
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
      movePlayer,
      clickItem,
      toggleEventMessage,
      gameEventMessage,
      gameState,
      mainPlayer,
      partnerPlayer,
      labyrinth: gameState.labyrinth,
    };
  },
});
</script>
