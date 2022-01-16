<template>
  <SceneComponent
    :labyrinth="labyrinth"
    :player="mainPlayer"
    :partner="partnerPlayer"
    @click-object="clickItem"
    @move-player="movePlayer"
  />
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
  <OverlayFeedbackComponent
    :opened="gameFeedback.opened"
    :headline="gameFeedback.headline"
    :subLine="gameFeedback.subline"
    :link="gameFeedback.link"
    :linkText="gameFeedback.linkText"
    :error="gameFeedback.error"
  />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";
import { useGameService } from "@/service/game/GameService";
import { useGameStore } from "@/service/game/GameStore";

import SceneComponent from "@/components/SceneComponent.vue";
import OverlayTerminalComponent from "@/components/overlays/OverlayTerminalComponent.vue";
import OverlayConversationComponent from "@/components/overlays/OverlayConversationComponent.vue";
import OverlayFeedbackComponent from "@/components/overlays/OverlayFeedbackComponent.vue";

import router from "@/router";
import "@/service/game/EventStore";

export default defineComponent({
  name: "GameView",
  components: {
    SceneComponent,
    OverlayTerminalComponent,
    OverlayConversationComponent,
    OverlayFeedbackComponent,
  },
  setup() {
    const { gameState, updateGameData, setLobbyKey } = useGameStore();
    const {
      gameEventMessage,
      gameFeedback,
      toggleEventMessage,
      movePlayer,
      clickItem,
      conversation,
      getConversationMessage,
      resetGameFeedback,
    } = useGameService();
    updateGameData();

    const labyrinth = computed(() => gameState.labyrinth);
    const mainPlayer = computed(() => gameState.mainPlayer);
    const partnerPlayer = computed(() => gameState.partnerPlayer);

    onMounted(async () => {
      const route = router.currentRoute.value;
      setLobbyKey(route.params.key as string);
      updateGameData();
      resetGameFeedback();
    });

    return {
      movePlayer,
      clickItem,
      toggleEventMessage,
      gameEventMessage,
      gameFeedback,
      mainPlayer,
      partnerPlayer,
      labyrinth,
      conversation,
      getConversationMessage,
    };
  },
});
</script>
