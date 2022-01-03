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

import { Orientation } from "@/service/labyrinth/Tile";
import { MoveOperation } from "@/service/game/EventMessage";

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
    const { gameState, updateGameData, setLobbyKey, setGameState } =
      useGameStore();
    const { playerMovement, itemSelection } = useGameService();
    const { loginState } = useLoginStore();
    const showTerminal = ref(false);

    //infos for sessionsStorage to fill GameState onMounted
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

    //called when view is loaded or reloaded
    onMounted(() => {
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
