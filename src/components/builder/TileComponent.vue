<template>
  <div class="tile" :style="{ width: size + `px` }" @click="onClick">
    <div
      class="tile__inner"
      :class="[
        { gutter: gutter },
        { selected: model.isSelected },
        { selectable: model.isSelectable },
      ]"
    >
    <i v-if="model.isStart" class="fas fa-map-marker"></i>
    <i v-if="model.isEnd" class="fas fa-map-marker-alt"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { TileModel } from "@/service/labyrinth/builder/TileModel";
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "TileComponent",
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
    },
  },
  setup(props, { emit }) {
    const selected = computed(() => props.model?.isSelected);
    const selectable = computed(() => props.model?.isSelectable);

    function onClick() {
      emit("click", props.model);
    }
    return { selected, selectable, onClick };
  },
});
</script>

<style lang="scss" scoped>
.tile {
  height: auto;
  
  i {
    position: absolute;
    color: $color-dark-green;
    font-size: 30px;
  }

  &__inner {
    height: 100%;
    padding-bottom: 100%;

    &.selected {
      background: $color-white;
    }

    &.gutter {
      border: 1px solid $color-grey;

      &.selectable {
        background: rgba($color-light-green, 0.2);
      }
    }
  }
}
</style>
