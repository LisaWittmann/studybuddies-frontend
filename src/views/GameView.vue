<template>
  <SceneComponent
    :labyrinth="labyrinth"
    :player="mainPlayer"
    :partner="partnerPlayer"
    @click-object="clickItem"
    @move-player="movePlayer"
  />
  <div class="score-box"><p>{{score}} CP</p></div>
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
  />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";
import { useGameService } from "@/service/game/GameService";
import { useGameStore } from "@/service/game/GameStore";

import SceneComponent from "@/components/SceneComponent.vue";
import OverlayTerminalComponent from "@/components/overlays/OverlayTerminalComponent.vue";
import OverlayConversationComponent from "@/components/overlays/OverlayConversationComponent.vue";

import router from "@/router";
import "@/service/game/EventStore";

export default defineComponent({
  name: "GameView",
  components: {
    SceneComponent,
    OverlayTerminalComponent,
    OverlayConversationComponent,
  },
  props: {
    key: { type: String, required: true },
  },
  setup() {
    const { gameState, getGameSessionStorage, updateGameData, setLobbyKey } =
      useGameStore();
    const {
      gameEventMessage,
      toggleEventMessage,
      movePlayer,
      clickItem,
      conversation,
      getConversationMessage,
    } = useGameService();
    updateGameData();

    const labyrinth = computed(() => gameState.labyrinth);
    const mainPlayer = computed(() => gameState.mainPlayer);
    const partnerPlayer = computed(() => gameState.partnerPlayer);
    const score = computed(() => gameState.score);


    onMounted(async () => {
      const route = router.currentRoute.value;
      setLobbyKey(route.params.key as string);
      updateGameData();
      getGameSessionStorage();
    });

    return {
      movePlayer,
      clickItem,
      toggleEventMessage,
      gameEventMessage,
      gameState,
      mainPlayer,
      partnerPlayer,
      labyrinth,
      score,
      conversation,
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
    width: 7rem;
    max-height: fit-content;
    margin: 1rem;
    padding: $spacing-xs $spacing-s;
    background-image: url("../../src/assets/img/score-bg.svg");
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;

    p {
      font-family: $font-inconsolata;
      font-weight: bold;
      color: $color-beige;
      padding: 0 1rem;
      text-align: center;
    }
  }
  

</style>
