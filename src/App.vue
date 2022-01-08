<template>
  <audio hidden loop autoplay="autoplay" ref="music">
    <source src="@/assets/sounds/background.mp3" type="audio/mpeg" />
  </audio>
  <router-view @play="play" @pause="pause" @volume="setVolume" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useLoginStore } from "@/service/login/LoginStore";
export default defineComponent({
  setup() {
    const { getLoginSessionStorage } = useLoginStore();
    getLoginSessionStorage();

    const music = ref({} as HTMLAudioElement);
    const play = () => music.value.play();
    const pause = () => music.value.pause();
    const setVolume = (volume: number) => (music.value.volume = volume);

    onMounted(() => setVolume(0.006));

    return { music, play, pause, setVolume };
  },
});
</script>