<template>
  <div class="inventory">
    <button
      id="invbutton"
      class="inventory-button"
      v-bind:class="[isOpen ? 'open' : 'closed']"
      @click="toggleInventoryButton"
    ></button>
    <transition name="slide-fade">
      <div class="inventory-box" v-if="isOpen">
        <div class="inventory-items">
          <div
            v-for="item of inventory"
            :key="item.id"
            class="inventory-item-box"
          >
            <InventoryItemEntryComponent :item="item" />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";

import { useGameStore } from "@/service/game/GameStore";

import InventoryItemEntryComponent from "@/components/InventoryItemEntryComponent.vue";

export default defineComponent({
  name: "InventoryComponent",
  props: {},
  components: {
    InventoryItemEntryComponent,
  },
  setup() {
    const { gameState } = useGameStore();
    const isOpen = ref(false);
    const mainPlayer = computed(() => gameState.mainPlayer);
    const inventory = computed(() => mainPlayer.value.getInventory());

    /**
     * shows opened or closed backpack svg (inventory button)
     */
    function toggleInventoryButton() {
      isOpen.value = !isOpen.value;
    }

    /**
     * lights up the backpack (inventory button) if item is added to inventory
     */
    const lightUpInventoryButton = () => {
      const button = document.getElementById("invbutton");
      if (button) {
        button.classList.add("button--lightup");
        setTimeout(() => button.classList.remove("button--lightup"), 2000);
      }
    };

    /**
     * watches changes from inventory to call the lightUpInventoryButton method
     */
    watch(
      [inventory],
      () => {
        lightUpInventoryButton();
      },
      { deep: true }
    );

    return {
      mainPlayer,
      inventory,
      toggleInventoryButton,
      isOpen,
    };
  },
});
</script>

<style lang="scss" scoped>
.closed {
  background: url(../assets/img/inventory/inventory-closed-btn.svg) no-repeat
    top left;
}

.open {
  background: url(../assets/img/inventory/inventory-open-btn.svg) no-repeat top
    left;
}

/* Animation for opening or closing inventory */
/* durations and timing functions.            */
.slide-fade-enter-active {
  @include fade-in-animation();
}
.slide-fade-leave-active {
  @include fade-out-animation();
}

.inventory {
  position: absolute;
  top: 10px;
  bottom: 10px;
  left: 10px;
  box-sizing: border-box;
  display: grid;

  .inventory-button {
    box-shadow: none;
    border: none;
    z-index: 11;
    background-position: left;
    display: inline-block;
    height: 100%;
    padding: 0;
  }

  .inventory-box {
    height: 100%;
    width: 100%;
    z-index: 10;
    left: 0;
    top: 0;
    transform-origin: top;
    overflow: scroll;
    scrollbar-width: none;

    .inventory-items {
      user-select: none;
      overflow-y: scroll;
      max-height: -webkit-fill-available;
      direction: rtl;
      scrollbar-width: none;
    }
  }
}

.inventory-item-box {
  display: flex;
  border: 1.5px dashed $color-beige;
  background-color: rgba($color-dark-brown, 0.5);
  margin: 2rem auto 2rem 0.2rem;
  direction: ltr;
  position: relative;
}

.inventory-item-box:first-child {
  margin-top: 0;
}

/*SCROLLBAR----*/
/* width */
::-webkit-scrollbar {
  /* Scrollbar hidden at the moment */
  display: none;
  width: 5px;
}

::-webkit-scrollbar-button {
  display: none;
}

/* Track */
::-webkit-scrollbar-track {
  background: $color-black;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background-color: rgba($color-grey, 0.2);
  border-radius: 2px;
}

//media-queries
@media (min-width: 1921px) {
  .inventory {
    grid-template-rows: 1fr 6fr;
    width: 10%;

    .inventory-item-box {
      width: 40%;
    }
  }
}

@media (min-width: 1501px) and (max-width: 1920px) {
  .inventory {
    grid-template-rows: 1fr 6fr;
    width: 10%;
  }

  .inventory-item-box {
    width: 45%;
  }
}

@media (min-width: 1001px) and (max-width: 1500px) {
  .inventory {
    grid-template-rows: 1fr 5fr;
    width: 20%;

    .inventory-item-box {
      width: 30%;
    }
  }
}

@media (max-width: 1000px) {
  .inventory {
    width: 30%;
    grid-template-rows: 2fr 9fr;

    .inventory-item-box {
      width: 45%;
    }
  }
}
</style>
