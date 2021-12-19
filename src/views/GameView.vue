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
    @select-option="getConversationMessage"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from "vue";
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

    // conversations with interactive game characters
    const conversation = reactive({
      character: "",
      message: new Message("", "", undefined, []),
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

    async function getConversationMessage(id: string): Promise<Message> {
      console.log(conversation.character, id);
      return fetch(`/api/npc/${conversation.character}/${id}`, {
        method: "GET",
      })
        .then((response) => {
          if (!response.ok) throw new Error(response.statusText);
          console.log(response);
          if(response.body) return response.json();
        })
        .then((jsonData) => {
          console.log(jsonData);
          if (!jsonData) conversation.visible = false;
          const message = new Message(
            jsonData.id,
            jsonData.text,
            jsonData.itemName,
            []
          );
          for (const key in jsonData.responses) {
            const response = jsonData.responses[key];
            message.responses.push(
              new Response(response.id, response.text, response.redirect)
            );
          }
          return message;
        });
    }

    async function startConversation(character: string) {
      conversation.character = character;
      getConversationMessage("1.1").then(
        (message) => (conversation.message = message)
      );
      conversation.visible = true;
    }

    onMounted(() => {
      startConversation("tupel");
    });

    return {
      movePlayer,
      itemSelection,
      toggleTerminal,
      selectConversationOption,
      getConversationMessage,
      mainPlayer,
      conversation,
      eventMessage,
      gameState,
    };
  },
});
</script>
