<template>
  <div class="radio-input__wrapper">
    <input
      type="radio"
      :value="option"
      :id="option"
      :disabled="disabled"
      @change="onClick(option)"
      name="radio-input"
    />
    <label :for="option" class="button" :class="{ disabled: disabled }">
      <img :src="getImgUrl(option)" :alt="option" />
      {{ capitalize(option) }}
    </label>
  </div>
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
      emit("clicked", option);
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
.radio-input__wrapper {
  width: 40%;
  position: relative;

  input[type="radio"] {
    height: 100%;
    opacity: 0;

    & + label {
      @include flex-center();
      flex-direction: column;
      padding-top: 20px;
      padding-bottom: 20px;

      img {
        width: 80%;
        margin-bottom: 10px;
      }
    }

    &:checked + label {
      border: solid $color-beige;
    }

    &:disabled {
      & + label {
        pointer-events: none;
        opacity: 0.5;
      }

      &:checked + label {
        opacity: 1;
      }
    }
  }
}
</style>
