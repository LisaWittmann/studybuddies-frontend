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
  background-color: rgba(0, 0, 0, 0.6);
  color: $color-white;
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 10;
  left: 0;
  top: 0;
}
</style>
