<template>
  <div v-if="opened" class="overlay">
    <!-- @slot content -->
    <slot><h1>This is an overlay</h1></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "OverlayComponent",
  props: {
    opened: {
      type: Boolean,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.overlay {
  @include flex-center();
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: $color-white;
}
</style>
