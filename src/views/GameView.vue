<template>
  <SceneComponent
    :labyrinth="labyrinth"
    :player="mainPlayer"
    :partner="partnerPlayer"
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
import { computed, defineComponent, reactive } from "vue";
import { useGameService } from "@/service/game/GameService";
import { useLoginStore } from "@/service/login/LoginStore";
import { useGameStore } from "@/service/game/GameStore";

import { Orientation } from "@/service/labyrinth/Tile";
import { MoveOperation } from "@/service/game/EventMessage";
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
    const { gameState, updateGameData } = useGameStore();
    const { playerMovement, itemSelection } = useGameService();
    const { loginState } = useLoginStore();
    updateGameData();

    /*
    // Users Array -> Wird onMounted gefüllt
    const users = ref(new Array<string>());
    

    onMounted(async () => {
      const route = router.currentRoute.value;
      setLobbyKey(route.params.key as string);
      await updateUsers(gameState.lobbyKey);
      updateGameData();
    })
    */

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

    const toggleTerminal = () => (eventMessage.visible = !eventMessage.visible);

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
      partnerPlayer,
      labyrinth: gameState.labyrinth,
    };
  },
});
</script>
