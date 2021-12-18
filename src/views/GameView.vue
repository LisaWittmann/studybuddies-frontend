<template>
  <SceneComponent
    :labyrinth="labyrinth"
    :player="mainPlayer"
    @click-object="itemSelection"
    @move-player="movePlayer"
    @click-disabled="toggleTerminal"
  />
  <!--warning and errormessages-->
  <OverlayTerminalComponent
    :opened="eventMessage.visible"
    :message="eventMessage.message"
    :state="eventMessage.state"
    @close="toggleTerminal"
  />
  <!--conversations with interactive characters-->
  <OverlayConversationComponent
    :opened="conversation.visible"
    :message="conversation.message"
    @select-option="selectConversationOption"
  />
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { useGameService } from "@/service/game/GameService";
import { useLoginStore } from "@/service/login/LoginStore";
import { useGameStore } from "@/service/game/GameStore";

import { Orientation } from "@/service/labyrinth/Tile";
import { MoveOperation } from "@/service/game/EventMessage";
import { MainPlayer } from "@/service/game/Player";
import { Message, Response } from "@/service/game/Conversation";

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
    const { gameState, updateGame } = useGameStore();
    const { playerMovement, itemSelection } = useGameService();
    const { loginState } = useLoginStore();
    updateGame();

    const mainPlayer = gameState.playerMap.get(loginState.username);

    // in-game messages like warnings, errors, hints ...
    const eventMessage = reactive({
      message: "Dieser Computer ist passwortgeschützt. Kein Zugriff möglich!",
      state: "warning",
      visible: false,
    });

    const testConversation = new Message(
      "1",
      "Magst du die Zahl 17?",
      undefined,
      [
        new Response("11", "Ja, finde ich super"),
        new Response("12", "Nein, ich bin eher Fan von der 18"),
      ]
    );

    // conversations with interactive game characters
    const conversation = reactive({
      message: testConversation,
      visible: true,
    });

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

    const toggleTerminal = () => (eventMessage.visible = !eventMessage.visible);

    function movePlayer(orientation: Orientation) {
      playerMovement(
        new MoveOperation(
          temporaryCode,
          (mainPlayer as MainPlayer).username,
          Orientation[orientation].toString()
        )
      );
    }

    // testing conversation
    function selectConversationOption(response: Response) {
      console.log(response);
      if (!response.redirect) conversation.visible = false;
    }

    return {
      movePlayer,
      itemSelection,
      toggleTerminal,
      selectConversationOption,
      testConversation,
      mainPlayer,
      conversation,
      eventMessage,
      gameState,
    };
  },
});
</script>
