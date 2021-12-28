<template>
  <OverlayComponent :opened="opened">
    <div class="terminal">
      <div class="terminal__header">
        <i class="fas fa-times-circle" @click="close"></i>
        {{ username }} –– -zsh
      </div>
      <div class="terminal__content">
        {{ username }}@mi ~ %
        <span :class="`terminal__content--${state}`">{{ message }}</span>
      </div>
    </div>
  </OverlayComponent>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import OverlayComponent from "@/components/overlays/OverlayComponent.vue";
import { useLoginStore } from "@/service/login/LoginStore";

export default defineComponent({
  name: "OverlayTerminalComponent",
  components: { OverlayComponent },
  props: {
    opened: {
      type: Boolean,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    /**
     * state of the message
     * @values neutral, warning, error
     */
    state: {
      type: String,
      default: "neutral",
    },
  },
  setup(_, { emit }) {
    const { loginState } = useLoginStore();
    const username = loginState.username;
    const close = () => emit("close");

    return { username, close };
  },
});
</script>

<style lang="scss" scoped>
.terminal {
  max-width: 500px;
  width: 80%;
  pointer-events: none;

  &__header {
    @include flex-center();
    font-family: $font-inconsolata;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    border: 1px solid #252525;
    background: $color-white;
    color: $color-black;
    position: relative;
    height: 25px;

    & i {
      pointer-events: all;
      position: absolute;
      color: $color-black;
      margin: 5px;
      left: 0;
      top: 0;

      &:hover {
        color: darkslategrey;
      }
    }
  }

  &__content {
    position: relative;
    font-family: $font-inconsolata;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    border: 1px solid #252525;
    background: $color-black;
    color: $color-white;
    min-height: 220px;
    line-height: 130%;
    text-align: left;
    padding: 8px;

    span {
      font-family: $font-inconsolata;
    }

    &--neutral {
      color: $color-white;
    }
    &--warning {
      color: orange;
    }
    &--error {
      color: red;
    }
  }
}
</style>
