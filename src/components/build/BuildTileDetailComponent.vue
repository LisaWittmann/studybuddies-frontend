<template>
  <div class="tile-detail"></div>
</template>

<script lang="ts">
import { TileModel } from "@/service/labyrinth/build/TileModel";
import { defineComponent } from "vue";

export default defineComponent({
  name: "BuildTileDetailComponent",
  props: {
    model: {
      type: TileModel,
      required: true,
    },
  },
  setup() {
    console.log("setting up tile detail component");
  },
});
</script>

<style lang="scss" scoped>
.tile-detail {
}
</style>
