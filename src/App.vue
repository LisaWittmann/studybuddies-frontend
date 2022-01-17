<template>
  <router-view />
  <LoadingComponent v-if="loading" />
  <OverlayFeedbackComponent
    :opened="feedback.opened"
    :headline="feedback.headline"
    :subLine="feedback.subline"
    :error="feedback.error"
    :link="feedback.link"
    :linkText="feedback.linkText"
    @close="resetFeedback"
  />
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useLoginStore } from "@/service/login/LoginStore";
import { useAppService } from "@/service/AppService";

import LoadingComponent from "@/components/LoadingComponent.vue";
import OverlayFeedbackComponent from "@/components/overlays/OverlayFeedbackComponent.vue";

export default defineComponent({
  components: { LoadingComponent, OverlayFeedbackComponent },
  setup() {
    const { getLoginSessionStorage } = useLoginStore();
    getLoginSessionStorage();

    const { appFeedbackState, appState, resetFeedback } = useAppService();
    const loading = computed(() => appState.loading);
    const feedback = computed(() => appFeedbackState);

    return { loading, feedback, resetFeedback };
  },
});
</script>
