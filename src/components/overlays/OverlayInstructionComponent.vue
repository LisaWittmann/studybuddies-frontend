<template>
  <OverlayComponent closeButton :opened="opened" @close="close">
    <p class="overlay__instruction">{{ text }}</p>
  </OverlayComponent>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import OverlayComponent from "@/components/overlays/OverlayComponent.vue";

export default defineComponent({
  name: "OverlayInstructionComponent",
  components: { OverlayComponent },
  props: {
    opened: {
      type: Boolean,
      required: true,
    },
    text: {
      type: String,
      required: true,
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
  background-color: rgba(0, 0, 0, 0.9);
  &__instruction {
    font-weight: $outfit-regular;
    font-size: $text-xl;
    max-width: $width-xl;
    width: $pref-width;
    @include text-break();
  }
}
</style>
