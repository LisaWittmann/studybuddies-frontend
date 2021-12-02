<template>

  <section class="dropDownMenuWrapper">

  <button class="dropDownMenuButton" v-on:click="openClose">Labyrinth auswählen (Dropdown)</button>
  <!---  <button class="dropDownMenuButton" @click="openClose">{{selectedLabyrinth}}</button>  --->

    <div class="iconWrapper">
      <div class="bar1" :class="{ 'bar1--open' : isOpen }" />
      <div class="bar2" :class="{ 'bar2--open' : isOpen }" />
      <div class="bar3" :class="{ 'bar3--open' : isOpen }" />
    </div>

<!--- v-if does not work, idk why yet --->
    <section class="dropdownMenu" v-if="isOpen === true">
      <div class="menuArrow" />
      <section class="option">
        <a href="#">Labyrinth 1</a>
      </section>
      <section class="option">
        <a href="#">Labyrinth 2</a>
      </section>
      <section class="option">
        <a href="#">Labyrinth 3</a>
      </section>      
    </section>

  </section>

</template>


<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: "DropdownMenu",
  setup() {
    let isOpen = false;

    // should open or close the dropdown menu
    function openClose() {
      //console.log("In Funktion openClose()");
      if(isOpen == false) {
          isOpen = true;
      }else{
        isOpen = false;
      }
      //console.log(isOpen);
    }
    return { isOpen, openClose }
  },
})
</script>


<style lang="scss" scoped>
.dropDownMenuWrapper {
  position: relative;
  width: 500px;
  left: 37vw;
  height: 30px;
  border-radius: 8px;
  background: white;
  border: 1px solid #eee;
  box-shadow: 10px 10px 0 0 rgba(black,.03);
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  * {
    box-sizing: border-box;
    text-align: left;
  }
  .iconWrapper {
    width: 25px;
    height: 25px;
    position: absolute;
    right: 30px;
    top: 50%;
    transform: translate(0,-50%);
    z-index: 1;

    .bar1 {
      width: 100%;
      max-width: 28px;
      height: 3px;
      background: blue;
      position: absolute;
      top: 50%;
      left: 50%;
      border-radius: 9999px;
      transform: translate(-50%, calc(-50% - 8px) );
      transition: all 0.2s ease;
    }

.bar1--open {
      transform: translate(-50%, -50%) rotate(45deg);
      margin-top: 0;
      background: red;
    }

.bar2 {
      width: 100%;
      max-width: 28px;
      height: 3px;
      background: blue;
      position: absolute;
      top: 50%;
      left: 50%;
      border-radius: 9999px;
      opacity: 1;
      transform: translate(-50%, -50%);
      transition: all 0.2s ease;
    }
.bar2--open {
      opacity: 0;
    }

.bar3 {
      width: 100%;
      max-width: 28px;
      height: 3px;
      background: blue;
      position: absolute;
      top: 50%;
      left: 50%;
      border-radius: 9999px;
      transform: translate(-50%, calc(-50% + 8px) );
      transition: all 0.2s ease;
}

.bar3--open {
      top: 50%;
      transform: translate(-50%, -50% ) rotate(-45deg);
      background: red;
    }

  }
}


</style>
