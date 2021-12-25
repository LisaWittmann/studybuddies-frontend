<template>
  <div class="tile-canvas" :style="{ width: `${size}px` }">
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
      <i
        v-if="model.objectsInRoom.length > 0"
        class="fas fa-box-open"
        @click="toggleDetails"
      ></i>
    </div>
  </div>
  <BuildTileDetailComponent
    v-if="showDetails"
    :open="false"
    :size="size"
    :items="model.objectsInRoom"
    @remove="onRemove"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { Role } from "@/service/labyrinth/build/BuildMode";
import { ItemModel, TileModel } from "@/service/labyrinth/build/TileModel";
import BuildTileDetailComponent from "@/components/build/BuildTileDetailComponent.vue";

export default defineComponent({
  name: "BuildTileComponent",
  components: { BuildTileDetailComponent },
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
    const selected = computed(() => props.model.relationKey);
    const selectable = computed(() => props.model.isSelectable);

    const color = computed(() => {
      if (props.model.restrictions?.length == 2) return "brown";
      if (props.model.restrictions?.includes(Role.DESIGNER)) return "beige";
      if (props.model.restrictions?.includes(Role.HACKER)) return "green";
      else return "default";
    });

    const showDetails = ref(false);
    const toggleDetails = () => (showDetails.value = !showDetails.value);

    const onClick = () => emit("click", props.model);
    const onEnter = () => emit("enter", props.model);

    const onRemove = (item: ItemModel) => emit("remove", props.model, item);

    return {
      selected,
      selectable,
      color,
      showDetails,
      toggleDetails,
      onRemove,
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
        &--brown {
          background: $color-dark-brown;
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
      z-index: 3;

      @include color-scheme(dark) {
        color: $color-dark-green;
      }
    }
  }
}
.tile-detail {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  bottom: 100px;
  margin-top: auto;
  margin-bottom: auto;
}
</style>
