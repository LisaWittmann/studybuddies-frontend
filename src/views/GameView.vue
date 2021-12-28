<template>
  <SceneComponent :labyrinth="labyrinth" :player="mainPlayer" <<<<<<< HEAD
  @click-object="clickItem" ======= :partner="partnerPlayer"
  @click-object="itemSelection" >>>>>>> 87796dc7c07fc8470cd624f024d776351c4afcbb
  @move-player="movePlayer" @click-disabled="toggleEventMessage" />
  <!--warning and errormessages-->
  <OverlayTerminalComponent
    :opened="eventMessage.visible"
    :message="eventMessage.message"
    :state="eventMessage.state"
    @close="toggleEventMessage"
  />
  <!--conversations with interactive characters-->
  <OverlayConversationComponent
    :opened="conversation.visible"
    :message="conversation.message"
    @respond="getConversationMessage"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useGameService } from "@/service/game/GameService";
import { useLoginStore } from "@/service/login/LoginStore";
import { useGameStore } from "@/service/game/GameStore";

import { Orientation } from "@/service/labyrinth/Tile";
import { MoveOperation } from "@/service/game/EventMessage";

import SceneComponent from "@/components/SceneComponent.vue";
import OverlayTerminalComponent from "@/components/overlays/OverlayTerminalComponent.vue";
import OverlayConversationComponent from "@/components/overlays/OverlayConversationComponent.vue";

import "@/service/game/EventStore";

export default defineComponent({
  name: "GameView",
  components: {
    SceneComponent,
    OverlayConversationComponent,
    OverlayTerminalComponent,
  },
  props: {
    key: { type: String, required: true },
  },
  setup() {
    const { loginState } = useLoginStore();
    const { gameState, updateGameData } = useGameStore();
    const {
      eventMessage,
      toggleEventMessage,
      playerMovement,
      clickItem,
      conversation,
      getConversationMessage,
    } = useGameService();
    updateGameData();

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
     * By recieving the Orientation it creats a MoveOperation to send it to the BE via GameService Methode
     * @param orientation : used in the backend to identify the direction to move the player
     */
    function movePlayer(orientation: Orientation) {
      playerMovement(
        new MoveOperation(
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
      getConversationMessage,
      conversation,
      eventMessage,
      gameState,
      mainPlayer,
      partnerPlayer,
      labyrinth: gameState.labyrinth,
    };
  },
});
</script>
