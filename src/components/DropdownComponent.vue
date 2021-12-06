<template>
  <section class="dropdown-menu-wrapper">
    <button class="dropdown-menu-button" @click="openClose">
      Labyrinth auswählen
    </button>

    <div class="icon-wrapper">
      <div class="bar-1" :class="{ 'bar-1--open': isOpen }" />
      <div class="bar-2" :class="{ 'bar-2--open': isOpen }" />
      <div class="bar-3" :class="{ 'bar-3--open': isOpen }" />
    </div>

    <div class="dropdown-menu" v-if="isOpen === true">
      <div class="menu-arrow" />
      <div class="option">
        <a href="#">Labyrinth 1</a>
      </div>
      <div class="option">
        <a href="#">Labyrinth 2</a>
      </div>
      <div class="option">
        <a href="#">Labyrinth 3</a>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "DropdownComponent",
  setup() {
    let isOpen = ref(false);

    // open or close the dropdown menu
    function openClose() {
      isOpen.value = !isOpen.value;
    }
    return { isOpen, openClose };
  },
});
</script>

<style lang="scss" scoped>
.dropdown-menu-wrapper {
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

  .dropdown-menu-button {
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

  .icon-wrapper {
    width: 25px;
    height: 25px;
    position: absolute;
    right: 30px;
    top: 50%;
    transform: translate(0, -50%);
    z-index: 1;

    .bar-1 {
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

    .bar-1--open {
      transform: translate(-50%, -50%) rotate(45deg);
      margin-top: 0;
      background: red;
    }

    .bar-2 {
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

    .bar-2--open {
      opacity: 0;
    }

    .bar-3 {
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

    .bar-3--open {
      top: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      background: red;
    }
  }

  .dropdown-menu {
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

    .menu-arrow {
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
</style>
