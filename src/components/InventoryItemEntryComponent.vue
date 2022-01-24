<template>
  <button
    class="trade-button"
    v-if="playersInSameTile"
    :class="[isVisible ? 'show' : 'hide']"
    :title="getTradeValue(item.modelName)"
    @click="tradeItem(item.id)"
  ></button>
  <img
    class="item-img"
    :src="getImgUrl(item.modelName)"
    :alt="item.modelName"
    width="300"
    @contextmenu.prevent="toggleTradeButton()"
  />
</template>

<script lang="ts">
import { Item } from "@/service/labyrinth/Item";
import { computed, defineComponent, ref } from "vue";
import { useGameStore } from "@/service/game/GameStore";
import { useGameService } from "@/service/game/GameService";

export default defineComponent({
  name: "InventoryItemEntryComponent",
  props: {
    item: {
      type: Item,
      required: true,
    },
  },
  setup() {
    const { gameState } = useGameStore();
    const { tradeItem } = useGameService();
    const playersInSameTile = computed(() => gameState.playersInSameTile);
    const isVisible = ref(false);

    /**
     * creates image url
     */
    function getImgUrl(imgName: string) {
      return require("@/assets/img/items/" + imgName.toLowerCase() + ".svg");
    }

    /**
     * shows or hides trade button for single item
     */
    function toggleTradeButton() {
      isVisible.value = !isVisible.value;
    }

    /**
     * gets value to inform player which item will be traded
     */
    function getTradeValue(modelName: string): string {
      if (modelName === "USB") {
        return modelName + " übergeben";
      } else {
        return (
          modelName.charAt(0) + modelName.slice(1).toLowerCase() + " übergeben"
        );
      }
    }

    return {
      playersInSameTile,
      getImgUrl,
      toggleTradeButton,
      isVisible,
      getTradeValue,
      tradeItem,
    };
  },
});
</script>

<style lang="scss" scoped>
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
</style>
