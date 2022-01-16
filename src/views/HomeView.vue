<template>
  <div class="home">
    <div class="home__background">
      <transition name="slow-fade" appear>
        <img
          class="home__background-image"
          src="@/assets/img/background.jpg"
          alt="background"
        />
      </transition>
    </div>
    <div class="flex-container">
      <div class="column-wrapper">
        <transition name="slow-fade" appear>
          <img class="home__header" :src="header" alt="logo" />
        </transition>
        <transition name="delay-slow-fade" appear>
          <router-link
            to="/find"
            class="button button--small button--pulse button--filled"
          >
            Jetzt spielen
          </router-link>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "HomeView",
  setup() {
    const header = computed(() => {
      if (matchMedia("(prefers-color-scheme: dark)").matches) {
        return require("@/assets/img/logo_header_dark.png");
      }
      return require("@/assets/img/logo_header.png");
    });

    return { header };
  },
});
</script>

<style lang="scss" scoped>
.home {
  &__background {
    position: relative;
    overflow: hidden;
    height: 100vh;

    &-image {
      width: 100%;
      min-height: 100%;
      object-fit: cover;
      filter: grayscale(20%) brightness(70%);
      opacity: 0.2;

      @include color-scheme(dark) {
        opacity: 0.15;
        filter: grayscale(0%) brightness(90%);
      }
    }
  }

  &__header {
    width: 100%;
    max-width: $width-xl;

    @include color-scheme(dark) {
      filter: drop-shadow(1px 1px 10px rgba(215, 208, 213, 0.02));
    }
  }

  .flex-container {
    position: absolute;
    z-index: 2;
    top: 0;
  }
}
</style>
