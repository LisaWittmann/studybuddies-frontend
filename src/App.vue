<template>
  <audio hidden loop ref="music"></audio>
  <router-view @music="setMusic" @volume="setVolume" @pause="pause" />
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
    const audioPath = (name: string) => require(`@/assets/sounds/${name}.mp3`);

    const pause = () => music.value.pause();

    const setVolume = (volume: number) => (music.value.volume = volume);
    const setMusic = (name: string) => {
      music.value.src = audioPath(name);
      music.value.play();
    };

    onMounted(() => setVolume(0.1));

    return {
      loading,
      feedback,
      resetFeedback,
      music,
      pause,
      setVolume,
      setMusic,
    };
  },
});
</script>
