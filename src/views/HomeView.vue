<template>
  <div class="container">
    <div class="image-wrapper">
      <img src="@/assets/img/background.jpg" alt="background" />
    </div>
    <div class="flex-container">
      <div class="column-wrapper">
        <img class="header" :src="header" alt="logo" />
        <router-link to="/login"> Jetzt spielen </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, onMounted, ref } from "vue";

export default defineComponent({
  name: "HomeView",
  setup() {
    const inView = ref(false);
    const header = computed(() => {
      if (matchMedia("(prefers-color-scheme: dark)").matches) {
        return require("@/assets/img/logo_header_dark.png");
      }
      return require("@/assets/img/logo_header.png");
    });

    onMounted(() => {
      inView.value = true;
    });
    onBeforeMount(() => {
      inView.value = false;
    });
    return { header, inView };
  },
});
</script>

<style lang="scss" scoped>
.image-wrapper {
  position: relative;
  overflow: hidden;
  height: 100vh;

  img {
    width: 100%;
    min-height: 100%;
    object-fit: cover;
    filter: grayscale(20%) brightness(70%);
    opacity: 0.2;

    @include color-scheme(dark) {
      opacity: 0.1;
    }
  }
}

.flex-container {
  position: absolute;
  z-index: 2;
  top: 0;

  img {
    width: 80%;
    max-width: 800px;
  }
}
</style>
