<template>
  <div v-if="opened" class="overlay">
    <button
      v-if="closeButton"
      class="overlay__close button__icon"
      @click="close"
    >
      <i class="fas fa-times"></i>
    </button>
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
    closeButton: {
      type: Boolean,
      default: false,
    },
  },
  setup(_, { emit }) {
    const close = () => emit("close");
    return { close };
  },
});
</script>

<style lang="scss" scoped>
.overlay {
  &__close {
    font-size: $headline-l;
    font-weight: $outfit-extra-light;
    position: absolute;
    z-index: inherit;
    margin: $spacing-s $spacing-m;
    top: 0;
    right: 0;
    color: $color-white;
  }
}
</style>
