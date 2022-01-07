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
