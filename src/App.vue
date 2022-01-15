<template>
  <router-view />
  <LoadingComponent v-if="loading" />
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useLoginStore } from "@/service/login/LoginStore";
import { useGameStore } from "@/service/game/GameStore";
import LoadingComponent from "@/components/LoadingComponent.vue";

export default defineComponent({
  components: { LoadingComponent },
  setup() {
    const { getLoginSessionStorage } = useLoginStore();
    getLoginSessionStorage();

    const { gameState } = useGameStore();
    const loading = computed(() => gameState.loading);

    return { loading };
  },
});
</script>
