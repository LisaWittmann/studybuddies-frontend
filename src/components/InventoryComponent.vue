<template>
    <div class="inventory-box">
        <div class="inventory">

        </div>
            <h2>Inventar</h2>
    </div>
</template>

<script lang="ts">
import { useGameStore } from "@/service/game/GameStore";
import { useLoginStore } from "@/service/login/LoginStore";

import { defineComponent } from "vue";

export default defineComponent({
  name: "InventoryComponent",
  props: {
   
  },
  setup() {
    const { gameState} = useGameStore();
    const { loginState } = useLoginStore();

    const mainPlayer = gameState.playerMap.get(loginState.username);  


    return {
      mainPlayer,
    };
  },
});
</script>

<style lang="scss" scoped>
    .inventory-box {
        position: absolute;
        height: 100%;
        z-index: 10;
        left: 0;
        top: 0;
        background-color:white;
    }

</style>
