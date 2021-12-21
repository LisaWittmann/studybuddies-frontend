<template>
  <div class="tool">
    <transition name="fade" appear>
      <div v-if="showOptions" class="tool__options">
        <button
          v-for="tool in options"
          :key="tool"
          class="button__icon--circle"
          @click="select(tool)"
        >
          <i class="fas fa-fill-drip"></i>
        </button>
      </div>
      <button class="button__icon--circle" @click="toggleOptions">
        <i class="fas fa-fill-drip"></i>
      </button>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "BuildToolComponent",
  props: {
    mode: {
      type: Number,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
  },
  setup(_, { emit }) {
    const showOptions = ref(false);
    const selectedTool = ref(0);

    function toggleOptions() {
      showOptions.value = !showOptions.value;
    }

    function select(tool: number) {
      selectedTool.value = tool;
      emit("select", tool);
    }

    return { showOptions, toggleOptions, select };
  },
});
</script>

<style lang="scss" scoped>
.tool {
  font-size: $headline-xl;
  &__options {
    margin-bottom: 20px;
    > * {
      margin: 5px 0px;
    }
  }
}
</style>
