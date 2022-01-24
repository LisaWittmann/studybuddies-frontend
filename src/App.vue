<template>
  <audio hidden loop autoplay="autoplay" ref="music">
    <source src="@/assets/sounds/background.mp3" type="audio/mpeg" />
  </audio>
  <router-view @play="play" @pause="pause" @volume="setVolume" />
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
import { defineComponent, computed, onMounted, ref } from "vue";
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

    const music = ref({} as HTMLAudioElement);
    const play = () => music.value.play();
    const pause = () => music.value.pause();
    const setVolume = (volume: number) => (music.value.volume = volume);

    onMounted(() => setVolume(0.006));

    return { loading, feedback, resetFeedback, music, play, pause, setVolume };
  },
});
</script>