<template>
  <div class="tool">
    <transition name="fade" appear>
      <div v-if="showOptions" class="tool__options">
        <button
          v-for="(option, index) in options"
          :key="index"
          class="button__icon--circle button--filled"
          :class="optionClass(option)"
          @click="select(index)"
        >
          <img :src="image(index)" />
        </button>
      </div>
    </transition>
    <button
      class="button__icon--circle button--filled"
      :class="[{ open: showOptions }, optionClass(selected)]"
      @click="toggleOptions"
    >
      <img :src="image(selected)" />
    </button>
  </div>
</template>

<script lang="ts">
import { Role } from "@/service/labyrinth/build/BuildMode";
import { ItemModel } from "@/service/labyrinth/build/TileModel";
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

    const select = (index: number) => {
      emit("select", props.options[index]);
      showOptions.value = false;
    };

    const image = (index: number) => {
      const option = props.options[index];
      if (option instanceof ItemModel) {
        return require(`@/assets/img/items/${option.modelName.toLowerCase()}.svg`);
      }
      switch (option) {
        case Role.DESIGNER:
          return require("@/assets/img/roles/designer-role.svg");
        case Role.HACKER:
          return require("@/assets/img/roles/hacker-role.svg");
      }
    };

    const optionClass = (index: number) => {
      switch (props.options[index]) {
        case Role.DESIGNER:
          return "button__option-designer";
        case Role.HACKER:
          return "button__option-hacker";
        default:
          return "";
      }
    };

    return { showOptions, toggleOptions, select, image, optionClass };
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

  .button__option-designer:not(.open) {
    background: $color-green;
  }

  .button__option-hacker:not(.open) {
    background: $color-beige;
  }
}
</style>
