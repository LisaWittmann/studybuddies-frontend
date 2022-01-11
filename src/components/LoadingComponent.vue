<template>
  <div class="loading">
    <div class="loader-ring">
      <div class="loader-ring--light"></div>
      <div class="loader-ring--track"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "LoadingComponent",
});
</script>

<style lang="scss" scoped>
$ring-size: 200px;
$ring-width: 6px;

.loading {
  position: absolute;
  z-index: 10;
  top: 0;
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
  width: $ring-size;
  height: $ring-size;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: $ring-size/-2 0 0 $ring-size/-2;

  &--light {
    width: $ring-size;
    height: $ring-size;
    border-radius: 100%;
    animation: rotate-360 2s linear infinite;
    box-shadow: 0 $ring-width 0 lighten($color-light-green, 10%) inset;
    @include color-scheme(dark) {
      box-shadow: 0 $ring-width 0 lighten($color-dark-green, 10%) inset;
    }
  }
  &--track {
    position: absolute;
    top: 0;
    left: 0;
    width: $ring-size;
    height: $ring-size;
    border-radius: 100%;
    box-shadow: 0 0 10px $ring-width rgba($color-grey, 0.3) inset;
    @include color-scheme(dark) {
      box-shadow: 0 0 10px $ring-width rgba(black, 0.3) inset;
    }
  }
}

@keyframes rotate-360 {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
