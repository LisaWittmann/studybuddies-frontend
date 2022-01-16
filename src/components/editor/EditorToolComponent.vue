<template>
  <div class="editor-tool">
    <transition name="fade" appear>
      <div v-if="showOptions" class="editor-tool__options">
        <button
          v-for="(option, index) in options"
          :key="index"
          class="button__icon--circle button--filled"
          :class="optionClass(index)"
          @click="select(index)"
        >
          <img :src="image(index)" alt="Missing Option" />
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
import { Role } from "@/service/game/Player";
import { ItemModel } from "@/service/editor/TileModel";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "EditorToolComponent",
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

    const getClass = (role: Role | undefined) => {
      switch (role) {
        case Role.DESIGNER:
          return "button__option-designer";
        case Role.HACKER:
          return "button__option-hacker";
        default: return "";
      }
    };

    const optionClass = (index: number) => {
      const option = props.options[index];
      if (option instanceof ItemModel) {
        return getClass(option.blockedRole);
      } else {
        return getClass(option as Role);
      }
    };

    return { showOptions, toggleOptions, select, image, optionClass };
  },
});
</script>

<style lang="scss" scoped>
.editor-tool {
  font-size: $headline-xl;

  &__options {
    margin-bottom: 20px;

    > * {
      margin: 5px 0;
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
