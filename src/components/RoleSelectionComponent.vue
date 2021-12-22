<template>
  <input
    type="radio"
    :value="option"
    :id="option"
    :disabled="disabled"
    @change="onClick(option)"
    name="radio-input"
  />
  <label :for="option" class="button">
    <img :src="getImgUrl(option)" :alt="option" />
    {{ capitalize(option) }}
  </label>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    option: { type: String, required: true },
    disabled: { type: Boolean, default: false },
  },
  setup(_, { emit }) {
    /**
     * creates image url
     */
    function getImgUrl(imgName: string) {
      return require("../assets/img/roles/" +
        imgName.toLowerCase() +
        "-role.svg");
    }
    function onClick(option: string) {
      emit("clicked", capitalize(option));
    }

    const capitalize = (name: string) => {
      return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    };

    return {
      getImgUrl,
      onClick,
      capitalize,
    };
  },
});
</script>

<style lang="scss" scoped>
input[type="radio"] {
  position: absolute;
  opacity: 0;

  + label {
    @include flex-center();
    flex-direction: column;
    padding-top: 20px;
    padding-bottom: 20px;
    width: 30%;

    img {
      cursor: pointer;
      width: 80%;
      margin-bottom: 10px;
    }
  }

  &:disabled + label {
    opacity: 0.5;
    pointer-events: none;
  }

  &:checked + label {
    opacity: 1;
    border: solid $color-beige;
  }
}
</style>
