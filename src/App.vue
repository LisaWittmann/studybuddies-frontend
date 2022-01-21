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
import { useLoginService } from "@/service/login/LoginService";
import { useAppService } from "@/service/AppService";

import LoadingComponent from "@/components/LoadingComponent.vue";
import OverlayFeedbackComponent from "@/components/overlays/OverlayFeedbackComponent.vue";

export default defineComponent({
  components: { LoadingComponent, OverlayFeedbackComponent },
  setup() {
    const { getSession } = useLoginService();
    getSession();

    const { feedbackState, globalState, resetFeedback } = useAppService();
    const loading = computed(() => globalState.loading);
    const feedback = computed(() => feedbackState);

    return { loading, feedback, resetFeedback };
  },
});
</script>
