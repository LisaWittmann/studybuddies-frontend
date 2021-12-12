<template>
    <div class="inventory-box">
        <div class="inventory">
          <div v-for="[key, value] in inventory" :key="key" class="inventory-item-box">
            <img class="item-img" :src="getImgUrl(value.modelName)" :alt="value.modelName" width="300"/>
          </div>

        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

import { useGameStore } from "@/service/game/GameStore";
import { useLoginStore } from "@/service/login/LoginStore";
import { MainPlayer } from "@/service/game/Player";
import { Item } from "@/service/labyrinth/Item";


export default defineComponent({
  name: "InventoryComponent",
  props: {
   
  },
  setup() {
    const { gameState} = useGameStore();
    const { loginState } = useLoginStore();

    //casting because playerMap only holds type Player -> here we only need MainPlayer
    const mainPlayer: MainPlayer | undefined = (gameState.playerMap.get(loginState.username) as MainPlayer);  
    let inventory: Map<number, Item> = new Map<number, Item>();

    if (mainPlayer != undefined){
      inventory = reactive(mainPlayer.getInventory());
      //Whats in the inventory -> remove later
      console.log("INVENTAR:");
      for (let key of inventory.keys()){
        console.log(inventory.get(key)?.modelName);
      }
    }

    /**
     * creates image url
     */
    function getImgUrl(imgName : string){
      return require('../assets/img/inventory/'+imgName+'.svg')  
    }


    return {
      mainPlayer,
      inventory,
      getImgUrl
    };
  },
});
</script>

<style lang="scss" scoped>
    .inventory-box {
        position: absolute;
        height: 100%;
        width: 10%;
        z-index: 10;
        left: 0;
        top: 0;
        background-color: $color-black;
        box-shadow: 0px 0 20px rgba($color-black, .75);
    }

    .inventory {
      padding: 1.5rem;
      margin-top: 4rem;
      overflow-y: scroll;
      max-height: -webkit-fill-available;
      direction: rtl;
    }

    .inventory-item-box{
      width: 100%;
      display: flex;
      border: 1.5px dashed $color-beige;
      background-color: rgba($color-grey, .2);
      margin: 2rem 0;
      direction: ltr;
    }

    .item-img{
      width: 100%;
      height: auto;
      transition-duration: .3s;
      margin: 1rem;
    }

     .inventory-item-box:hover .item-img{
      transform: scale(1.05);
      filter: drop-shadow(0px 0px 10px rgba(255,255,255,.5));
    }

    /*SCROLLBAR----*/
    /* width */
  ::-webkit-scrollbar {
      width: 5px;
  }

  ::-webkit-scrollbar-button {
    display: none;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background:  $color-black;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background-color: rgba($color-grey, .2);
    border-radius: 2px;
  }


</style>
