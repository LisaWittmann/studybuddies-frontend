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
        <div
          v-for="item in inventory"
          :key="item"
          class="inventory-item-box"
        >
          <button
            class="trade-button"
            v-if="playersInSameTile"
            v-bind:class="[isVisible ? 'show' : 'hide']"
            :title="getTradeValue(item.modelName)"
            @click="giveItemToPartner(item)"
          ></button>
          <img
            class="item-img"
            :src="getImgUrl(item.modelName)"
            :alt="item.modelName"
            width="300"
            @contextmenu.prevent="showTradeButton(item)"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, watch } from "vue";

import { useGameStore } from "@/service/game/GameStore";
import { Item } from "@/service/labyrinth/Item";
import { useGameService } from "@/service/game/GameService";


export default defineComponent({
  name: "InventoryComponent",
  props: {},
  setup() {
    const { gameState } = useGameStore();
    const { tradeItem } = useGameService();
    let isOpen = ref(false);
    let isVisible = ref(false);
    const invbutton = ref(null);
    let mainPlayer = computed(() => gameState.mainPlayer);
    let inventory = computed(() => mainPlayer.value.getInventory());
    let playersInSameTile = computed(() => gameState.playersInSameTile);

/*     let inventoryTradeable: Array<{item : Item, tradeable: boolean}> = reactive([]);

    function updateInventory() {
      inventory.value.forEach((item: Item) => {
      if (!inventoryTradeable.filter(entry => {return entry.item.id = item.id;}) {

        } 
        if (!inventoryTradeable.find(obj => {return obj.item.id = item.id;})) {
          console.log("ENTRY NOT INCLUDED");
          inventoryTradeable.push({ item: item, tradeable: false });
        } else {
          console.log("ENTRY INCLUDED");
        } 
      });
    }
 */
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

    function showTradeButton(item: string) {
      isVisible.value = !isVisible.value;
      console.log(item, "VISIBLE", isVisible.value);
    }

    function getTradeValue(modelName: string): string {
      console.log(modelName);
      if (modelName === "USB") {
        return modelName + " übergeben";
      } else {
        return (
          modelName.charAt(0) + modelName.slice(1).toLowerCase() + " übergeben"
        );
      }
    }


    function giveItemToPartner(item: Item) {
      console.log("ITEM TO TRADE FROM", mainPlayer.value.username, item.id.toString());
      tradeItem(mainPlayer.value.username, item.id.toString());
    }

    /**
     * watches changes from inventory to call the lightUpInventoryButton method
     */
    watch(
      [inventory],
      () => {
        lightUpInventoryButton();
        //updateInventory();
      },
      { deep: true }
    );

    return {
      mainPlayer,
      inventory,
      playersInSameTile,
      getImgUrl,
      toggleInventoryButton,
      isOpen,
      isVisible,
      invbutton,
      showTradeButton,
      getTradeValue,
      giveItemToPartner,
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
  width: 25%;
  z-index: 10;
  left: 0;
  top: 0;
  max-width: 25%;
  transform-origin: top;
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
  margin-top: calc(15vh + 10px);
  overflow-y: scroll;
  max-height: -webkit-fill-available;
  direction: rtl;
  padding-left: 10px;
}

.inventory-item-box {
  width: 20%;
  display: flex;
  border: 1.5px dashed $color-beige;
  background-color: rgba($color-dark-brown, 0.5);
  margin: 2rem auto 2rem 0;
  direction: ltr;
  position: relative;
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

.trade-button {
  position: absolute;
  left: 120%;
  width: 4rem;
  height: 50%;
  padding: 0;
  margin-top: 25%;
  background: url(../assets/img/inventory/trade-button.svg) no-repeat center;
  border: none;
  box-shadow: none;
}

.show {
  display: block;
}

.hide {
  display: none;
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
