<template>
  <button
    id="invbutton"
    class="inventory-button"
    v-bind:class="[isOpen ? 'open' : 'closed']"
    @click="toggleInventoryButton"
  ></button>
  <transition name="slide-fade">
    <div class="inventory-box" v-if="isOpen">
      <div class="inventory">
        <div v-for="item in inventory" :key="item" class="inventory-item-box">
          <img
            class="item-img"
            :src="getImgUrl(item.modelName)"
            :alt="item.modelName"
            width="300"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from "vue";

import { useGameStore } from "@/service/game/GameStore";

export default defineComponent({
  name: "InventoryComponent",
  props: {},
  setup() {
    const { gameState } = useGameStore();
    let isOpen = ref(false);
    const invbutton = ref(null);

    //casting because playerMap only holds type Player -> here we only need MainPlayer
    let mainPlayer = computed(() => gameState.mainPlayer);
    let inventory = computed(() => mainPlayer.value.getInventory());


    /**
     * creates image url
     */
    function getImgUrl(imgName: string) {
      return require("../assets/img/inventory/" +
        imgName.toLowerCase() +
        ".svg");
    }
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
        setTimeout(() => button.classList.remove("button--lightup"), 20000);
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
      getImgUrl,
      toggleInventoryButton,
      isOpen,
      invbutton,
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

.inventory-button {
  box-shadow: none;
  border: none;
  position: absolute;
  left: 0;
  top: 10px;
  z-index: 11;
  background-position: bottom;
  display: inline-block;
  height: 15%;
  width: 10%;
  max-width: 120px;
}

.inventory-box {
  position: absolute;
  height: 100%;
  width: 10%;
  z-index: 10;
  left: 0;
  top: 0;
  max-width: 120px;
  transform-origin: top;
}
/* Animation for opening or closing inventory */
/* durations and timing functions.            */
.slide-fade-enter-active {
  @include fade-in-animation();
}
.slide-fade-leave-active {
  @include fade-out-animation() ;
}


.inventory {
  padding: 0 1.5rem 1.5rem 1.5rem;
  margin-top: 8.5rem;
  overflow-y: scroll;
  max-height: -webkit-fill-available;
  direction: rtl;
}

.inventory-item-box {
  width: 100%;
  display: flex;
  border: 1.5px dashed $color-beige;
  background-color: rgba($color-dark-brown, 0.5);
  margin: 2rem 0;
  direction: ltr;
}

.inventory-item-box:first-child {
  margin-top: 0;
}

.item-img {
  width: 100%;
  height: auto;
  transition-duration: 0.3s;
  margin: 1rem;
}

.inventory-item-box:hover .item-img {
  transform: scale(1.05);
  filter: drop-shadow(0px 0px 10px rgba(255, 255, 255, 0.5));
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
</style>
