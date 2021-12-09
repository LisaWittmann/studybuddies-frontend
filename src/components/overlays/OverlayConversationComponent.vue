<template>
  <OverlayComponent :opened="opened">
    <div class="conversation">
      <div class="conversation__content">
        <p>{{ text }}</p>
      </div>
      <div class="conversation__option-wrapper">
        <div
          class="conversation__option"
          v-for="(option, index) of options"
          :key="index"
          @click="clickOption(option)"
        >
          {{ option }}
        </div>
      </div>
    </div>
  </OverlayComponent>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import OverlayComponent from "@/components/overlays/OverlayComponent.vue";

export default defineComponent({
  namae: "OverlayConversationComponent",
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
    options: {
      type: [],
      required: true,
    },
  },
  setup(_, { emit }) {
    function clickOption(value: string) {
      emit("select-option", value);
    }

    return { clickOption };
  },
});
</script>

<style lang="scss" scoped>
.conversation {
  width: 80%;
  max-width: 500px;
  color: $color-black;
  min-height: 60%;
  font-size: 18px;

  &__content {
    background: $color-white;
    text-align: left;
    border-radius: 5px;
    min-height: 200px;
    padding: $spacing-xs $spacing-s;
  }

  &__option {
    background: $color-light-green;
    border-radius: 5px;
    margin-right: $spacing-s;
    padding: $spacing-s;
    text-align: left;

    &:last-of-type {
      margin-right: 0;
    }

    &:hover {
      background: $color-green;
      cursor: pointer;
    }

    &-wrapper {
      @include flex-center();
      margin-top: $spacing-s;
    }
  }
}
</style>
