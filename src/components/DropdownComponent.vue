<template>
  <section class="dropdown">
    <button class="dropdown__button button--large" @click="openClose">
      <div class="text-wrapper">
        <span v-if="selectedItem">Labyrinth {{ selectedItem }}</span>
        <span v-else>Labyrinth auswählen</span>
      </div>
      <div class="icon-wrapper">
        <div class="bar bar-1" :class="{ 'bar-1--open': isOpen }" />
        <div class="bar bar-2" :class="{ 'bar-2--open': isOpen }" />
        <div class="bar bar-3" :class="{ 'bar-3--open': isOpen }" />
      </div>
    </button>

    <div
      class="dropdown__menu button button--large button--filled"
      v-if="isOpen"
    >
      <div class="dropdown__menu-arrow" />
      <div
        class="dropdown__menu-option"
        v-for="(item, index) of items"
        :key="index"
        @click="selectItem(item)"
      >
        <div>Labyrinth {{ item }}</div>
      </div>
      <div
        class="dropdown__menu-option dropdown__menu-option--disabled"
        v-if="items.length < 1"
      >
        <div>Noch keine Labyrinthe verfügbar</div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { useLobbyService } from "@/service/LobbyService";
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    items: {
      type: Array,
    },
    selectedItem: {
      type: Number,
    },
  },
  name: "DropdownComponent",
  setup(props, context) {
    const { lobbyState } = useLobbyService();

    let isOpen = ref(false);

    // open or close the dropdown menu
    function openClose() {
      isOpen.value = !isOpen.value;
    }

    function selectItem(item: number) {
      if (item != lobbyState.selectedLabyrinth) {
        context.emit("select", item);
      }
      isOpen.value = false;
    }

    return { isOpen, openClose, selectItem, props };
  },
});
</script>

<style lang="scss" scoped>
.dropdown {
  @include flex-center();
  position: relative;

  button {
    @include flex-center();
    justify-content: space-between;
    padding: 25px;

    &:hover {
      font-weight: 300;
    }
  }

  .icon-wrapper {
    width: 25px;
    height: 25px;
    transform: translate(0, 0);

    .bar {
      width: 100%;
      max-width: 28px;
      height: 3px;
      position: absolute;
      top: 50%;
      left: 50%;
      border-radius: 9999px;
      transition: all 0.2s ease;

      @include color-scheme(light) {
        background: $color-dark-green;
      }

      @include color-scheme(dark) {
        background: $color-white;
      }
    }

    .bar-1 {
      transform: translate(-50%, calc(-50% - 8px));
      &--open {
        transform: translate(-50%, -50%) rotate(45deg);
        margin-top: 0;
        background: $color-beige;
      }
    }

    .bar-2 {
      transform: translate(-50%, -50%);
      &--open {
        opacity: 0;
      }
    }

    .bar-3 {
      transform: translate(-50%, calc(-50% + 8px));
      &--open {
        top: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        background: $color-beige;
      }
    }
  }

  &__menu {
    @include float-animation();
    position: absolute;
    flex-direction: column;
    text-align: left;
    top: 100%;

    &.button {
      padding: 10px 0px;
    }

    @include color-scheme(light) {
      background: $color-white;
      color: $color-black;
      box-shadow: 10px 10px 0 0 rgba(black, 0.03);
      &-arrow {
        background: $color-white;
      }
    }

    @include color-scheme(dark) {
      background: $color-black-background;
      color: $color-white;
      box-shadow: 10px 10px 0 0 rgba(grey, 0.03);
      &-arrow {
        background: $color-black-background;
      }
    }

    &-arrow {
      width: 20px;
      height: 20px;
      position: absolute;
      border-left: 1px solid $color-grey;
      border-top: 1px solid $color-grey;
      top: -10px;
      left: 20px;
      transform: rotate(45deg);
      border-radius: 4px 0 0 0;
    }

    &-option {
      width: 100%;

      &--disabled {
        pointer-events: none;
      }

      > * {
        margin: 0px 20px;
        padding: 25px 0px;
        border-bottom: 1px solid $color-grey;
      }

      &:last-child > * {
        border-bottom: 0;
      }

      &:hover {
        color: $color-beige;
      }
    }
  }
}
</style>
