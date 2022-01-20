<template>
  <SceneComponent
    :labyrinth="labyrinth"
    :player="mainPlayer"
    :partner="partnerPlayer"
    @click-object="clickItem"
    @move-player="movePlayer"
  />
  <div class="score-box">
    <p>{{ score }}/210 CP</p>
  </div>
  <!--warning and error messages-->
  <OverlayTerminalComponent
    :opened="gameEventMessage.visible"
    :message="gameEventMessage.message"
    :state="gameEventMessage.state"
    @close="toggleEventMessage"
  />
  <!--conversations with interactive characters-->
  <OverlayConversationComponent
    :opened="conversation.visible"
    :message="conversation.message"
    @respond="getConversationMessage"
    @close="endConversation"
  />
  <!--player inventory-->
  <InventoryComponent />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { useGameService } from "@/service/game/GameService";
import { useGameStore } from "@/service/game/GameStore";

import SceneComponent from "@/components/SceneComponent.vue";
import OverlayTerminalComponent from "@/components/overlays/OverlayTerminalComponent.vue";
import InventoryComponent from "@/components/InventoryComponent.vue";
import OverlayConversationComponent from "@/components/overlays/OverlayConversationComponent.vue";

import router from "@/router";
import "@/service/game/EventStore";

export default defineComponent({
  name: "GameView",
  components: {
    SceneComponent,
    OverlayTerminalComponent,
    InventoryComponent,
    OverlayConversationComponent,
  },
  setup() {
    const { gameState, updateGameData, setLobbyKey } = useGameStore();
    const {
      gameEventMessage,
      toggleEventMessage,
      movePlayer,
      clickItem,
      conversation,
      getConversationMessage,
      forceGameEnd,
      endConversation,
    } = useGameService();
    updateGameData();

    const labyrinth = computed(() => gameState.labyrinth);
    const mainPlayer = computed(() => gameState.mainPlayer);
    const partnerPlayer = computed(() => gameState.partnerPlayer);
    const score = computed(() => gameState.score);

    onbeforeunload = () => {
      forceGameEnd();
      return "leaving game";
    };

    onBeforeRouteLeave((to) => {
      const nextKey = to.params.key as string;
      if (nextKey != gameState.lobbyKey) {
        forceGameEnd();
      }
    });

    onMounted(async () => {
      const route = router.currentRoute.value;
      setLobbyKey(route.params.key as string);
      updateGameData();
    });

    return {
      movePlayer,
      clickItem,
      toggleEventMessage,
      gameEventMessage,
      mainPlayer,
      partnerPlayer,
      labyrinth,
      score,
      conversation,
      endConversation,
      getConversationMessage,
    };
  },
});
</script>

<style lang="scss" scoped>
.score-box {
  position: absolute;
  top: 0;
  right: 0;
  width: 8rem;
  height: 4rem;
  margin: 1rem;
  padding: $spacing-xs $spacing-s;
  background-image: url("../../src/assets/img/score-bg.svg");
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;

  p {
    user-select: none;
    font-family: $font-inconsolata;
    font-weight: bold;
    color: $color-beige;
    padding: 0 1rem;
    text-align: center;
    margin: auto 0;
  }
}
</style>
