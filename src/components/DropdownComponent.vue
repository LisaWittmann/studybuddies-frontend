<template>
  <section class="dropdown">
    <button class="dropdown__button button--large" @click="openClose">
      <div class="text-wrapper">
        <span v-if="selectedItem">Labyrinth: {{ selectedItem }}</span>
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
        <div>{{ item }}</div>
      </div>
      <div
        class="dropdown__menu-option dropdown__menu-option--disabled"
        v-if="items.length < 1"
      >
        <div>Noch keine Labyrinthe verfügbar</div>
      </div>
    </div>

    <button
          type="submit"
          id="downloadButton"
          class="dwnBtn"
          v-bind:class="[isVisibleLab ? 'unhide' : 'hide']"
          @click="download(selectedItem)"
    >
          <i class="fas fa-download"></i>
    </button>
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
      type: String,
    },
  },
  name: "DropdownComponent",
  setup(props, context) {
    const { download, lobbyState } = useLobbyService();

    let isOpen = ref(false);
    let isVisibleLab = ref(false);

    // open or close the dropdown menu
    function openClose() {
      isOpen.value = !isOpen.value;
    }

    function selectItem(item: string) {
      if (item != lobbyState.selectedLabyrinthName) {
        context.emit("select", item);
        showDownloadButton();
      }
      isOpen.value = false;
    }

    function showDownloadButton() {
      if (!isVisibleLab.value) isVisibleLab.value = true;
    }

    return { isOpen, openClose, selectItem, download, isVisibleLab, showDownloadButton, props };
  },
});
</script>

<style lang="scss" scoped>
.dropdown {
  @include flex-center();
  position: relative;

  button {
    @include flex-center(space-between);
    padding: $spacing-s;

    &:hover {
      font-weight: $outfit-regular;
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
      @include background-secondary();
    }

    .bar-1 {
      transform: translate(-50%, calc(-50% - 8px));
      &--open {
        transform: translate(-50%, -50%) rotate(45deg);
        margin-top: 0;
        background-color: $color-beige;
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
        background-color: $color-beige;
      }
    }
  }

  &__menu {
    @include float-animation();
    @include background-primary();
    @include color-primary();
    position: absolute;
    flex-direction: column;
    text-align: left;
    top: 100%;

    &.button {
      padding: $spacing-xs 0;
      display: flex;
      justify-content: center;
    }

    &-arrow {
      width: 20px;
      height: 20px;
      position: absolute;
      @include border-left();
      @include border-top();
      top: -10px;
      left: 20px;
      transform: rotate(45deg);
      border-radius: 4px 0 0 0;
      @include background-primary();
    }

    &-option {
      width: 100%;

      &--disabled {
        pointer-events: none;
      }

      > * {
        margin: 0 $spacing-s;
        padding: $spacing-s 0;
        @include border-bottom();
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

.dwnBtn {
  border: none;
  padding: none;
  box-shadow: none;
  height: 9%;
  width: 7%;
}

.hide {
  visibility: hidden;
}

.unhide {
  visibility: visible;
}
</style>
