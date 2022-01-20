<template>
  <div class="pagination">
    <button
      class="button__icon"
      :disabled="activeIndex == 0"
      @click="selectPrev"
    >
      <i class="fas fa-chevron-circle-left"></i>
    </button>
    <ul class="pagination__item-wrapper">
      <li
        v-for="(item, index) in items"
        :key="index"
        :class="[{ active: isActive(index) }]"
        @click="select(index)"
      >
        {{ item }}
      </li>
    </ul>
    <button v-if="reachedLastItem" class="button__icon" @click="onComplete">
      <i class="fas fa-check-circle"></i>
    </button>
    <button v-else class="button__icon" @click="selectNext">
      <i class="fas fa-chevron-circle-right"></i>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from "vue";

export default defineComponent({
  name: "PaginationComponent",
  props: {
    items: {
      type: Array,
      required: true,
    },
    activeIndex: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const reachedLastItem = computed(
      () => props.activeIndex == props.items.length - 1
    );
    const isActive = (index: number) => {
      return props.activeIndex == index;
    };
    const selectPrev = () => {
      if (props.activeIndex - 1 >= 0) {
        select(props.activeIndex - 1);
      }
    };
    const selectNext = () => {
      if (props.activeIndex + 1 < props.items.length) {
        select(props.activeIndex + 1);
      }
    };

    const select = (index: number) => emit("select", props.items[index]);
    const onComplete = () => emit("complete");

    watch(
      () => props.activeIndex,
      () => {
        setTimeout(() => {
          const element = document.querySelector(".active");
          element?.scrollIntoView({ behavior: "smooth", inline: "center" });
        }, 100);
      }
    );

    return {
      reachedLastItem,
      isActive,
      selectPrev,
      selectNext,
      select,
      onComplete,
    };
  },
});
</script>

<style lang="scss" scoped>
.pagination {
  @include flex-center();
  height: 100%;
  width: 100%;
  background: $color-white;
  box-shadow: 0 0 15px rgba($color-black, 0.2);

  @include color-scheme(dark) {
    background: $color-black-background;
    box-shadow: 0 0 15px rgba($color-grey, 0.1);
  }

  &__item-wrapper {
    display: inline-flex;
    overflow-x: scroll;
    @include scroll-container();
    width: 80%;
    max-width: 800px;
    padding-inline-start: 0;

    > * {
      font-size: $text-xl;
      white-space: nowrap;
      cursor: pointer;
      list-style: none;
      margin-left: 0px;
      margin-right: 20px;
      opacity: 0.4;

      &.active {
        opacity: 1;
      }

      &::before {
        content: "/";
        margin-right: 20px;
      }

      &.active::before {
        opacity: 0.4;
      }

      &:first-of-type::before {
        content: "";
        margin-left: 50px;
      }

      &:last-of-type::after {
        content: "";
        margin-right: 50px;
      }
    }
  }
}

::-webkit-scrollbar {
  display: none;
}
</style>
