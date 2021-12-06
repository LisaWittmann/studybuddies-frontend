<template>
  <SceneComponent
    :labyrinth="labyrinth"
    :mainPlayer="mainPlayer"
    @click-object="itemSelection"
    @move-player="movePlayer"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useGameStore } from "@/service/game/GameStore";
import { useGameService } from "@/service/game/GameService";

import { Orientation } from "@/service/labyrinth/Tile";
import { MoveOperation } from "@/service/game/EventMessage";
import { MainPlayer } from "@/service/game/Player";

import SceneComponent from "@/components/SceneComponent.vue";
import "@/service/game/EventStore";

export default defineComponent({
  name: "GameView",
  components: { SceneComponent },
  setup() {
    const { gameState, updateGame } = useGameStore();
    const { playerMovement, itemSelection } = useGameService();

    const mainPlayer = gameState.playerMap.get("TestUser");

    function movePlayer(orientation: Orientation) {
      playerMovement(
        new MoveOperation(
          "lobbykey",
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
