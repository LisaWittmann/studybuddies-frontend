<template>
  <section class="dropDownMenuWrapper">
    <button class="dropDownMenuButton" v-on:click="openClose">
      Labyrinth auswählen (Dropdown)
    </button>
    <!---  <button class="dropDownMenuButton" @click="openClose">{{selectedLabyrinth}}</button>  --->

    <div class="iconWrapper">
      <div class="bar1" :class="{ 'bar1--open': isOpen }" />
      <div class="bar2" :class="{ 'bar2--open': isOpen }" />
      <div class="bar3" :class="{ 'bar3--open': isOpen }" />
    </div>

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
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "DropdownMenu",
  setup() {
    let isOpen = ref(false);

    // open or close the dropdown menu
    function openClose() {
      if (isOpen.value == false) {
        isOpen.value = true;
      } else {
        isOpen.value = false;
      }
    }
    return { isOpen, openClose };
  },
});
</script>

<style lang="scss" scoped>
.dropDownMenuWrapper {
  position: relative;
  width: 500px;
  margin: 0 auto;
  height: 80px;
  border-radius: 8px;
  background: white;
  border: 1px solid #eee;
  box-shadow: 10px 10px 0 0 rgba(black, 0.03);
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  * {
    box-sizing: border-box;
    text-align: left;
  }

  .dropDownMenuButton {
    border: none;
    font-size: inherit;
    background: none;
    outline: none;
    border-radius: 4px;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    padding: 0 70px 0 20px;
    margin: 0;
    line-height: 1;
    width: 100%;
    height: 100%;
    z-index: 2;
    cursor: pointer;
  }

  .dropDownMenuButton--dark {
    color: #eee;
  }

  .iconWrapper {
    width: 25px;
    height: 25px;
    position: absolute;
    right: 30px;
    top: 50%;
    transform: translate(0, -50%);
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
      transform: translate(-50%, calc(-50% - 8px));
      transition: all 0.2s ease;
    }

    .bar1--dark {
      background: #eee;
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

    .bar2--dark {
      background: #eee;
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
      transform: translate(-50%, calc(-50% + 8px));
      transition: all 0.2s ease;
    }

    .bar3--dark {
      background: #eee;
    }

    .bar3--open {
      top: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      background: red;
    }
  }

  .iconWrapper--noTitle {
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    width: auto;
    height: auto;
    transform: none;
  }

  .dropdownMenu {
    position: absolute;
    top: 100%;
    width: 100%;
    min-width: 300px;
    min-height: 10px;
    border-radius: 8px;
    border: 1px solid #eee;
    box-shadow: 10px 10px 0 0 rgba(black, 0.03);
    background: white;
    padding: 10px 30px;
    animation: menu 0.3s ease forwards;

    .menuArrow {
      width: 20px;
      height: 20px;
      position: absolute;
      top: -10px;
      left: 20px;
      border-left: 1px solid #eee;
      border-top: 1px solid #eee;
      background: white;
      transform: rotate(45deg);
      border-radius: 4px 0 0 0;
    }

    .menuArrow--dark {
      background: #333;
      border: none;
    }

    .option {
      width: 100%;
      border-bottom: 1px solid #eee;
      padding: 20px 0;
      cursor: pointer;
      position: relative;
      z-index: 2;

      &:last-child {
        border-bottom: 0;
      }

      * {
        color: inherit;
        text-decoration: none;
        background: none;
        border: 0;
        padding: 0;
        outline: none;
        cursor: pointer;
      }
    }

    .desc {
      opacity: 0.5;
      display: block;
      width: 100%;
      font-size: 14px;
      margin: 3px 0 0 0;
      cursor: default;
    }
  }

  .dropdownMenu--dark {
    background: #333;
    border: none;

    .option {
      border-bottom: 1px solid #888;
    }

    * {
      color: #eee;
    }
  }

  @keyframes menu {
    from {
      transform: translate3d(0, 30px, 0);
    }
    to {
      transform: translate3d(0, 20px, 0);
    }
  }
}

.dropDownMenuWrapper--noTitle {
  padding: 0;
  width: 60px;
  height: 60px;
}

.dropDownMenuWrapper--dark {
  background: #333;
  border: none;
}
</style>
