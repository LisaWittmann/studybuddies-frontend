<template>
  <div class="tool">
    <transition name="fade" appear>
      <div v-if="showOptions" class="tool__options">
        <button
          v-for="(option, index) in options"
          :key="index"
          class="button__icon--circle button--filled"
          :class="`button__option-${index}`"
          @click="select(option)"
        >
          <i class="fas fa-fill-drip"></i>
        </button>
      </div>
    </transition>
    <button
      class="button__icon--circle button--filled"
      :class="[{ open: showOptions }, `button__option-${selected}`]"
      @click="toggleOptions"
    >
      <i class="fas fa-fill-drip"></i>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "BuildToolComponent",
  props: {
    options: {
      type: Array,
      required: true,
    },
    selected: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const showOptions = ref(false);

    const toggleOptions = () => (showOptions.value = !showOptions.value);

    function select(index: number) {
      emit("select", props.options[index]);
      showOptions.value = false;
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

  .button__option-0:not(.open) {
    background: $color-beige;
  }

  .button__option-1:not(.open) {
    background: $color-green;
  }
}
</style>
