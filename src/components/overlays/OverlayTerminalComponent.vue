<template>
  <OverlayComponent :opened="opened">
    <div class="terminal">
      <div class="terminal__header">
        <em class="fas fa-times-circle" @click="close" />
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
     * @values neutral, success, warning, error
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
  max-width: $width-l;
  width: $pref-width;
  pointer-events: none;

  &__header {
    @include flex-center();
    font-family: $font-inconsolata;
    border-top-left-radius: $border-radius-xs;
    border-top-right-radius: $border-radius-xs;
    @include border(#252525);
    background: $color-white;
    color: $color-black;
    position: relative;
    height: 25px;

    & em {
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
    border-bottom-left-radius: $border-radius-xs;
    border-bottom-right-radius: $border-radius-xs;
    @include border(#252525);
    background: $color-black-background;
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
    &--success {
      color: green;
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
