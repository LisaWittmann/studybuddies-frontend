<template>
  <div class="tile-overview">
    <div class="tile-overview__content">
      <div
        class="tile-overview__item"
        v-for="(item, index) of model.objectsInRoom"
        :key="index"
      >
        <img v-if="image(index)" :src="image(index)" />
        <i class="fas fa-trash" @click="remove(index)"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ItemModel, TileModel } from "@/service/labyrinth/build/TileModel";
import { defineComponent } from "vue";

export default defineComponent({
  name: "BuildTileOverviewComponent",
  props: {
    model: {
      type: TileModel,
      required: true,
    },
    open: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const image = (index: number) => {
      const item = props.model.objectsInRoom[index];
      if (item instanceof ItemModel) {
        return require(`@/assets/img/items/${item.modelName.toLowerCase()}.svg`);
      }
    };
    const remove = (item: ItemModel) => emit("remove", item);

    return { image, remove };
  },
});
</script>

<style lang="scss" scoped>
.tile-overview {
  @include flex-center();

  &__content {
    @include flex-center();
    position: relative;
    flex-direction: column;
    border-radius: 0 8px 8px 0;
    background: $color-black-background;
    box-shadow: 0 0 50px rgba($color-black, 0.6);

    @include color-scheme(dark) {
      background: $color-white;
    }
  }

  &__item {
    @include flex-center();
    height: 80px;
    width: auto;
    margin: 10px;
    position: relative;

    img {
      height: 80%;
      width: auto;
    }

    i {
      font-size: $text-l;
      color: $color-grey;
      position: absolute;
      right: 0;
      top: 0;

      @include color-scheme(dark) {
        color: darkred;
      }
    }
  }
}
</style>
