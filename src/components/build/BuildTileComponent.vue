<template>
  <div
    class="tile-canvas"
    :style="{ width: `${size}px` }"
    :class="{ items: model.objectsInRoom.length > 0 }"
  >
    <div
      class="tile-canvas__inner"
      :class="[
        { selected: selected },
        { selectable: selectable && gutter },
        `color--${color}`,
      ]"
      :style="{ fontSize: `${size / 3}px` }"
      @click="onClick"
      @mouseenter="onEnter"
    >
      <i v-if="model.isStart" class="fas fa-map-marker"></i>
      <i v-if="model.isEnd" class="fas fa-map-marker-alt"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { Role } from "@/service/labyrinth/build/BuildMode";
import { TileModel } from "@/service/labyrinth/build/TileModel";

export default defineComponent({
  name: "BuildTileComponent",
  props: {
    size: {
      type: Number,
      required: true,
    },
    gutter: {
      type: Boolean,
      required: true,
    },
    model: {
      type: TileModel,
      required: true,
    },
  },
  setup(props, { emit }) {
    const selected = computed(() => !!props.model.relationKey);
    const selectable = computed(() => props.model.isSelectable);

    const color = computed(() => {
      if (props.model.restrictions?.length == 2) return "grey";
      if (props.model.restrictions?.includes(Role.DESIGNER)) return "green";
      if (props.model.restrictions?.includes(Role.HACKER)) return "beige";
      else return "default";
    });

    const onClick = () => emit("clicked", props.model);
    const onEnter = () => emit("entered", props.model);

    return {
      selected,
      selectable,
      color,
      onClick,
      onEnter,
    };
  },
});
</script>

<style lang="scss" scoped>
.tile-canvas {
  height: auto;
  border: 1px solid $color-grey;
  position: relative;

  &.items {
    border: 1px solid red;
  }

  &__inner {
    @include flex-center();
    height: 100%;
    padding-top: 100%;

    &.selectable {
      background: rgba($color-light-green, 0.3);
    }

    &.selected {
      background: $color-dark-green;

      @include color-scheme(dark) {
        background: $color-white;
      }

      &.color {
        &--grey {
          background: $color-grey;
        }

        &--green {
          background: $color-green;
        }

        &--beige {
          background: $color-beige;
        }
      }
    }

    i {
      color: $color-grey;
      font-size: inherit;
      position: absolute;
      top: 35%;
      z-index: 0;

      @include color-scheme(dark) {
        color: $color-dark-green;
      }
    }
  }
}
</style>
