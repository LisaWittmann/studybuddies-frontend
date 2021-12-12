<template>
  <SceneComponent
    :labyrinth="labyrinth"
    :player="mainPlayer"
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
import { defineComponent, ref } from "vue";
import { useGameService } from "@/service/game/GameService";
import { useLoginStore } from "@/service/login/LoginStore";
import { useGameStore } from "@/service/game/GameStore";

import { Orientation } from "@/service/labyrinth/Tile";
import { MoveOperation } from "@/service/game/EventMessage";
import { MainPlayer } from "@/service/game/Player";

import SceneComponent from "@/components/SceneComponent.vue";
import OverlayTerminalComponent from "@/components/overlays/OverlayTerminalComponent.vue";

import "@/service/game/EventStore";

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
    const { gameState, updateGame } = useGameStore();
    const { playerMovement, itemSelection } = useGameService();
    const { loginState } = useLoginStore();
    updateGame();

    const mainPlayer = gameState.playerMap.get(loginState.username);
    const showTerminal = ref(false);

    // in-game messages like warnings, errors, hints ...
    const message =
      "Dieser Computer ist passwortgeschützt. Kein Zugriff möglich!";
    // state of message that sets text color in terminal
    // state options: neutral, warning, error
    const messageState = "warning";

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

    const openTerminal = () => (showTerminal.value = true);
    const closeTerminal = () => (showTerminal.value = false);

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
      message,
      messageState,
      showTerminal,
      openTerminal,
      closeTerminal,
      itemSelection,
      movePlayer,
      mainPlayer,
      labyrinth: gameState.labyrinth,
    };
  },
});
</script>
