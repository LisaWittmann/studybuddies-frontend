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
  <!--conversations with interactive characters-->
  <OverlayConversationComponent
    :opened="conversation.visible"
    :message="conversation.message"
    @respond="getConversationMessage"
  />
  <!--instructions for current game quest-->
  <OverlayInstructionComponent
    :opened="showInstructions"
    :instructions="instructions"
    @close="closeInstructions"
  />
  <!--player inventory-->
  <InventoryComponent />
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
import OverlayInstructionComponent from "@/components/overlays/OverlayInstructionComponent.vue";
import InventoryComponent from "@/components/InventoryComponent.vue";

import OverlayConversationComponent from "@/components/overlays/OverlayConversationComponent.vue";

import router from "@/router";
import "@/service/game/EventStore";

export default defineComponent({
  name: "GameView",
  components: {
    SceneComponent,
    OverlayTerminalComponent,
    InventoryComponent,
    OverlayConversationComponent,
  },
  props: {
    key: { type: String, required: true },
  },
  setup() {
    const { loginState } = useLoginStore();
    const { gameState, updateGameData, setLobbyKey, setGameState } =
      useGameStore();
    const {
      gameEventMessage,
      toggleEventMessage,
      playerMovement,
      clickItem,
      conversation,
      getConversationMessage,
    } = useGameService();
    updateGameData();

    const labyrinthState = computed(() => gameState.labyrinth);
    const score = computed(() => gameState.score);
    const errormessage = computed(() => gameState.errormessage);

    let mainPlayer = computed(() => gameState.mainPlayer);
    let partnerPlayer = computed(() => gameState.partnerPlayer);

    //adds infos from GameState (filled on READY) to SessionStorage
    sessionStorage.setItem("labyrinth", JSON.stringify(labyrinthState.value));
    sessionStorage.setItem("score", JSON.stringify(score.value));
    sessionStorage.setItem("errormessage", JSON.stringify(errormessage.value));
    sessionStorage.setItem("initialLoad", JSON.stringify(1));

    onMounted(async () => {
      const route = router.currentRoute.value;
      setLobbyKey(route.params.key as string);
      updateGameData();

      //fills gameState out of sessionStorage when view is reloaded
      if (
        sessionStorage.getItem("mainPlayer") &&
        sessionStorage.getItem("partnerPlayer")
      ) {
        setGameState(
          sessionStorage.getItem("lobbyKey"),
          sessionStorage.getItem("selectedLabyrinth"),
          sessionStorage.getItem("labyrinth"),
          sessionStorage.getItem("mainPlayer"),
          sessionStorage.getItem("partnerPlayer"),
          sessionStorage.getItem("errormessage"),
          sessionStorage.getItem("score")
        );
      } else {
        sessionStorage.setItem("mainPlayer", JSON.stringify(mainPlayer.value));
        sessionStorage.setItem(
          "partnerPlayer",
          JSON.stringify(partnerPlayer.value)
        );
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
      conversation,
      getConversationMessage,
    };
  },
});
</script>
