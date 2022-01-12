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
  <!--player inventory-->
  <InventoryComponent />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";
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
      conversation,
      getConversationMessage,
    };
  },
});
</script>
