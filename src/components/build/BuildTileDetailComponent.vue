<template>
  <div class="tile-detail">
    <div class="tile-detail__item" v-for="(item, index) of items" :key="index">
      <img v-if="image(index)" :src="image(index)" />
    </div>
  </div>
</template>

<script lang="ts">
import { ItemModel } from "@/service/labyrinth/build/TileModel";
import { defineComponent } from "vue";

export default defineComponent({
  name: "BuildTileDetailComponent",
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  setup(props, { emit }) {
    const image = (index: number) => {
      const item = props.items[index];
      if (item instanceof ItemModel) {
        return require(`@/assets/img/items/${item.modelName.toLowerCase()}.svg`);
      }
    };

    return { image };
  },
});
</script>

<style lang="scss" scoped>
.tile-detail {
  @include flex-center();
  flex-direction: row;
    background: $color-white;
  border-radius: 8px;

  &__item {
    margin: 15px;
    height: 60px;
    width: auto;

    img {
      height: 100%;
      width: auto;
    }
  }
}
</style>
