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
    :node="conversation.node"
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

import SceneComponent from "@/components/SceneComponent.vue";
import OverlayTerminalComponent from "@/components/overlays/OverlayTerminalComponent.vue";
import OverlayConversationComponent from "@/components/overlays/OverlayConversationComponent.vue";

import "@/service/game/EventStore";
import { ConversationNode } from "@/service/game/ConversationNode";

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

    const testConversation = new ConversationNode(
      "1",
      undefined,
      "Magst du die Zahl 17?",
      new ConversationNode(
        "11",
        "Ja, finde ich super",
        "Das ist eine gute Wahl. Möchtest du einen Rat von mir?",
        new ConversationNode(
          "111",
          "Ja, sehr gerne",
          "Du solltest zusehen, dass du zur Semestereinführungsveranstaltung gelangst. Dort wirst du bestimmt neue Freunde finden.",
          new ConversationNode("111", "Dann mache ich mich auf den Weg"),
          new ConversationNode(
            "1112",
            "Was soll ich denn da?",
            "Du bist sehr unhöflich! Stelle nicht alles in Frage, was man dir rät.",
            new ConversationNode("11121", "Tschüss")
          )
        ),
        new ConversationNode("1112", "Nein, danke")
      ),
      new ConversationNode(
        "12",
        "Nein, ich bin eher Fan von der 18",
        "Du musst noch viel lernen...",
        new ConversationNode("121", "Tschüss")
      )
    );

    // conversations with interactive game characters
    const conversation = reactive({
      node: testConversation,
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
    function selectConversationOption(node: ConversationNode) {
      if (!node.text) conversation.visible = false;
      else conversation.node = node;
      if (node.item) console.log(node.item);
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
