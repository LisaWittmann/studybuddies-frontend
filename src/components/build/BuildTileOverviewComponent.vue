<template>
  <div class="tile-overview">
    <div class="tile-overview__content">
      <h1>Details</h1>
      <div v-if="model.isStart">
        <h2>Startposition:</h2>
        <div class="tile-overview__element">
          <span class="fas fa-map-marker icon-image"></span>
          <i class="fas fa-trash" @click="removeStartTile(model)"></i>
        </div>
      </div>
      <div v-if="model.isEnd">
        <h2>Ziel:</h2>
        <div class="tile-overview__element">
          <span class="fas fa-map-marker-alt icon-image"></span>
          <i class="fas fa-trash" @click="removeEndTile(model)"></i>
        </div>
      </div>
      <div v-if="model.restrictions.length > 0">
        <h2>Rollen:</h2>
        <div
          class="tile-overview__element"
          v-for="(role, index) of model.restrictions"
          :key="index"
        >
          <img :src="roleImage(role)" />
          <i class="fas fa-trash" @click="removeRestriction(model, role)"></i>
        </div>
      </div>
      <div v-if="model.objectsInRoom.length > 0">
        <h2>Items:</h2>
        <div
          class="tile-overview__element"
          v-for="(item, index) of model.objectsInRoom"
          :key="index"
        >
          <img :src="itemImage(item)" />
          <i class="fas fa-trash" @click="removeItem(model, item)"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Role } from "@/service/labyrinth/build/BuildMode";
import { ItemModel, TileModel } from "@/service/labyrinth/build/TileModel";
import { useBuildService } from "@/service/labyrinth/build/BuildService";

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
  setup() {
    const { removeItem, removeRestriction, removeEndTile, removeStartTile } =
      useBuildService();

    const itemImage = (item: ItemModel) => {
      return require(`@/assets/img/items/${item.modelName.toLowerCase()}.svg`);
    };

    const roleImage = (role: Role) => {
      let rolename = "";
      switch (role) {
        case Role.DESIGNER:
          rolename = "designer";
          break;
        case Role.HACKER:
          rolename = "hacker";
          break;
      }
      return require(`@/assets/img/roles/${rolename}-role.svg`);
    };

    return {
      itemImage,
      roleImage,
      removeItem,
      removeRestriction,
      removeEndTile,
      removeStartTile,
    };
  },
});
</script>

<style lang="scss" scoped>
.tile-overview {
  @include flex-center();

  &__content {
    @include flex-center();
    width: 90px;
    position: relative;
    flex-direction: column;
    border-radius: 0 8px 8px 0;
    background: $color-black-background;
    box-shadow: 0 0 50px rgba($color-black, 0.6);

    @include color-scheme(dark) {
      background: $color-white;
    }

    > * {
      width: 80%;
      text-align: left;
      hyphens: auto;
      color: $color-white;

      @include color-scheme(dark) {
        color: $color-black;
      }
    }

    h1 {
      font-size: $text-l;
    }

    h2 {
      font-size: $text-m;
      font-weight: 300;
    }
  }

  &__element {
    @include flex-center();
    height: 60px;
    width: auto;
    margin: 10px;
    position: relative;

    .icon-image {
      color: $color-dark-green;
      font-size: 40px;
    }

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
