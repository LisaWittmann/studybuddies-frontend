<template>
  <div class="labyrinth-canvas">
    <div class="labyrinth-canvas__row" v-for="row in rows" :key="row">
      <BuildTileComponent
        v-for="column in columns"
        :key="column"
        :size="tileSize"
        :gutter="gutter"
        :model="getTileModel(column, row)"
        @click="onClick"
        @enter="onEnter"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useBuildService } from "@/service/labyrinth/build/BuildService";
import { ItemModel, TileModel } from "@/service/labyrinth/build/TileModel";
import { Mode } from "@/service/labyrinth/build/BuildMode";
import BuildTileComponent from "@/components/build/BuildTileComponent.vue";

export default defineComponent({
  name: "BuildLabyrinthComponent",
  components: { BuildTileComponent },
  props: {
    tileSize: {
      type: Number,
      required: true,
    },
    mode: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      required: true,
    },
    item: {
      type: ItemModel,
      required: true,
    },
  },
  setup(props) {
    const {
      buildState,
      getTileModel,
      setStartTile,
      setEndTile,
      selectTile,
      setRestriction,
      setItem,
    } = useBuildService();

    let mousedown = false;
    addEventListener("mousedown", () => (mousedown = true));
    addEventListener("mouseup", () => (mousedown = false));

    const rows = computed(() => buildState.rows);
    const columns = computed(() => buildState.columns);
    const gutter = computed(() => props.mode == Mode.CREATE);

    function onEnter(model: TileModel) {
      if (props.mode != Mode.CREATE && props.mode != Mode.RESTRICTIONS) return;
      if (mousedown) onClick(model);
    }

    function onClick(model: TileModel) {
      switch (props.mode) {
        case Mode.CREATE: {
          selectTile(model);
          break;
        }
        case Mode.START: {
          setStartTile(model);
          break;
        }
        case Mode.END: {
          setEndTile(model);
          break;
        }
        case Mode.RESTRICTIONS: {
          setRestriction(model, props.role);
          break;
        }
        case Mode.ITEMS: {
          setItem(model, props.item);
        }
      }
    }

    return { rows, columns, gutter, getTileModel, onClick, onEnter };
  },
});
</script>

<style lang="scss" scoped>
.labyrinth-canvas {
  @include flex-center();
  flex-direction: column;
  flex-wrap: wrap;
  min-width: 100%;
  min-height: 100vh;

  &__row {
    @include flex-center();
    flex-wrap: nowrap;
    min-width: 100%;
    height: auto;
  }
}
</style>
