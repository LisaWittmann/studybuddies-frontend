<template>
  <button class="inventory-button" v-bind:class="[isOpen?'open':'closed']" @click="toggleInventoryButton"></button> 
  <transition name="slide-fade">
    <div class="inventory-box" v-if="isOpen">
        <div class="inventory">
          <div v-for="item in inventory" :key="item" class="inventory-item-box">
            <img class="item-img" :src="getImgUrl(item.modelName)" :alt="item.modelName" width="300"/>
          </div>

        </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from "vue";

import { useGameStore } from "@/service/game/GameStore";


export default defineComponent({
  name: "InventoryComponent",
  props: {
   
  },
  setup() {
    const { gameState} = useGameStore();
    let isOpen = ref(false);

    //casting because playerMap only holds type Player -> here we only need MainPlayer
    let mainPlayer = computed(() => gameState.mainPlayer);
    let inventory = computed(() => mainPlayer.value.getInventory());  

      //Whats in the inventory -> remove later
      console.log("INVENTAR:");
      for (let item of inventory.value){
        console.log(item.modelName);
      }
    

    /**
     * creates image url
     */
    function getImgUrl(imgName : string){
      return require('../assets/img/inventory/'+imgName.toLowerCase()+'.svg')  
    }
  /**
   * shows opened or closed backpack svg (inventory button) 
   */
    function toggleInventoryButton() {
      console.log("INVENTAR player:");
      for (let item of mainPlayer.value.getInventory()){
        console.log(item.modelName);
      }

      isOpen.value = !isOpen.value;
    }


    return {
      mainPlayer,
      inventory,
      getImgUrl,
      toggleInventoryButton,
      isOpen
    };
  },
});
</script>

<style lang="scss" scoped>
  .closed {
    background: url(../assets/img/inventory/inventory-closed-btn.svg) no-repeat top left;
  }

  .open {
    background: url(../assets/img/inventory/inventory-open-btn.svg) no-repeat top left;
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
    transition-duration: .3s;
  }

  .inventory-button:hover {
    filter: drop-shadow(0px 0px 10px rgb(255, 205, 42)) brightness(1.75);
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
    /* durations and timing functions.              */
    .slide-fade-enter-active {
      animation: fadeInDown .3s;
    }
    .slide-fade-leave-active {
      animation: fadeInDown .3s reverse;
    }

    @-webkit-keyframes fadeInDown {
      0% {
        opacity: 0;
        visibility: hidden;
        -webkit-transform: translateY(-200px);
        -webkit-transform: scaleY(0.5);
      }
      100% {
        opacity:1;
        visibility: visible;
        -webkit-transform: translateY(0);
        -webkit-transform: scaleY(1);
      }
    }

    @keyframes fadeInDown {
      0% {     
        opacity: 0;
        visibility: hidden;        
        -webkit-transform: translateY(-200px);
        -webkit-transform: scaleY(0.5);        
      }
      100% {
        opacity:1;
        visibility: visible;        
        -webkit-transform: translateY(0);
        -webkit-transform: scaleY(1);        
      }      
    }   

    .inventory {
      padding: 0 1.5rem 1.5rem 1.5rem;
      margin-top: 8.5rem;
      overflow-y: scroll;
      max-height: -webkit-fill-available;
      direction: rtl;
    }

    .inventory-item-box{
      width: 100%;
      display: flex;
      border: 1.5px dashed $color-beige;
      background-color: rgba($color-dark-brown, .5);
      margin: 2rem 0;
      direction: ltr;
    }

    .inventory-item-box:first-child {
      margin-top: 0;
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
    /* Scrollbar hidden at the moment */
    display: none;
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
