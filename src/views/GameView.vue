<template>
  <SceneComponent
    :labyrinth="labyrinth"
    :player="mainPlayer"
    @click-object="clickItem"
    @move-player="movePlayer"
    @click-disabled="toggleEventMessage"
  />
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
import { defineComponent } from "vue";
import { useGameService } from "@/service/game/GameService";
import { useLoginStore } from "@/service/login/LoginStore";
import { useGameStore } from "@/service/game/GameStore";

import { Orientation } from "@/service/labyrinth/Tile";
import { MoveOperation } from "@/service/game/EventMessage";
import { MainPlayer } from "@/service/game/Player";

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
    const { gameState, updateGame } = useGameStore();
    const {
      eventMessage,
      toggleEventMessage,
      playerMovement,
      clickItem,
      conversation,
      getConversationMessage,
    } = useGameService();
    updateGame();

    const mainPlayer = gameState.playerMap.get(loginState.username);

    //TODO: remove this temporary operation after showing GameView with key in URL
    let temporaryCode: string;

    fetch("/api/lobby/random", {
      method: "GET",
      headers: {
        "Content-Type": "html/text;charset=utf-8",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        temporaryCode = json.key;
      });

    function movePlayer(orientation: Orientation) {
      playerMovement(
        new MoveOperation(
          temporaryCode,
          (mainPlayer as MainPlayer).username,
          Orientation[orientation].toString()
        )
      );
    }

    return {
      movePlayer,
      clickItem,
      toggleEventMessage,
      getConversationMessage,
      mainPlayer,
      conversation,
      eventMessage,
      gameState,
    };
  },
});
</script>
