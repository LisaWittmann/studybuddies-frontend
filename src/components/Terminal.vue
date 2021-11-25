<template>
  <div class="terminal">
    <div class="terminal__header">username –– -zsh</div>
    <div class="terminal__content">
      <p>
        username@mi ~ % <span>Dieser PC ist passwortgeschützt! No Access!</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Terminal",
});
</script>

<style lang="scss" scoped>
.terminal {
  width: 400px;
  font-family: monospace;
  //box-shadow: 0 0 1em #252525;

  &__header {
    position: relative;
    color: $color-nearly-black;
    background: $color-nearly-white;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    padding: 3px;
    border: 1px solid #252525;
  }

  &__content {
    position: relative;
    background: $color-nearly-black;
    color: $color-nearly-white;
    height: 190px;
    text-align: left;
    padding: 8px;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    border: 1px solid #252525;

    p {
      margin: 0;
    }

    span {
      color: red;
    }
  }
}
</style>
