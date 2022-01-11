<template>
  <transition name="fade" appear>
    <div class="loader">
      <div class="loader-ring">
        <div class="loader-ring--light"></div>
        <div class="loader-ring--track"></div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "LoadingComponent",
});
</script>

<style lang="scss" scoped>
$loader-size: 150px;

.loader {
  @include flex-center();
  position: absolute;
  z-index: 10;
  top: 0;
  height: 100%;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background: $color-white;
  @include color-scheme(dark) {
    background: $color-black-background;
  }
}

.loader-ring {
  width: $loader-size;
  height: $loader-size;
  position: absolute;
  margin: -3px 0 0 -3px;

  > * {
    height: $loader-size;
    width: $loader-size;
    border-radius: 100%;
  }

  &--light {
    @include rotate-animation();
    box-shadow: 0 6px 0 lighten($color-light-green, 10%) inset;
    @include color-scheme(dark) {
      box-shadow: 0 6px 0 lighten($color-dark-green, 10%) inset;
    }
  }

  &--track {
    position: absolute;
    top: 0;
    left: 0;
    box-shadow: 0 0 10px 6px rgba($color-grey, 0.3) inset;
    @include color-scheme(dark) {
      box-shadow: 0 0 10px 6px rgba(black, 0.3) inset;
    }
  }
}
</style>
