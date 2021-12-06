<template>
  <SceneComponent
      :labyrinth="labyrinth"
      :mainPlayer="mainPlayer"
      @click-object="itemSelection"
      @move-player="movePlayer"
  />
</template>

<script lang="ts">
import {defineComponent, onMounted} from "vue";
import {useGameStore} from "@/service/game/GameStore";
import {useGameService} from "@/service/game/GameService";
import {useLoginStore } from "@/service/login/LoginStore";

import {Orientation} from "@/service/labyrinth/Tile";
import {MoveOperation} from "@/service/game/EventMessage";
import {MainPlayer} from "@/service/game/Player";

import SceneComponent from "@/components/SceneComponent.vue";
import "@/service/game/EventStore";

export default defineComponent({
  name: "GameView",
  components: {SceneComponent},
  setup() {
    const { gameState, updateGame } = useGameStore();
    const { playerMovement, itemSelection } = useGameService();
    const { loginState, fetchLocalStorage } = useLoginStore();
    onMounted(() => {
      fetchLocalStorage()
    });

    const mainPlayer = gameState.playerMap.get(loginState.username);

    //TODO: remove this temporary operation after showing GameView with key in URL
    let temporaryCode: string;

    fetch("/api/lobby/random", {
      method: "GET",
      headers: {
        "Content-Type": "html/text;charset=utf-8",
      }
    }).then((response) => {
      return response.json();
    }).then((json) => {
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
      itemSelection,
      movePlayer,
      mainPlayer,
      labyrinth: gameState.labyrinth,
    };
  },
});
</script>
