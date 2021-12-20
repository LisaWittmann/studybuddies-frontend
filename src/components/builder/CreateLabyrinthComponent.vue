<template>
  <div class="labyrinth-builder">
    <div class="row" v-for="row in rows" :key="row">
      <TileComponent
        v-for="column in columns"
        :key="column"
        :size="tileSize"
        :gutter="gutter"
        :model="getTileModel(column, row)"
        @click="onClick"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { TileModel, Vector2 } from "@/service/labyrinth/builder/TileModel";
import { defineComponent, ref, watch, computed } from "vue";
import TileComponent from "@/components/builder/TileComponent.vue";
import { Mode } from "@/service/labyrinth/builder/Builder";

export default defineComponent({
  name: "CreateLabyrinthComponent",
  components: { TileComponent },
  props: {
    rows: {
      type: Number,
      required: true,
    },
    columns: {
      type: Number,
      required: true,
    },
    tileSize: {
      type: Number,
      required: true,
    },
    mode: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    console.log("setting up");
    const tileModels = ref(new Array<TileModel>());
    updateTileModels();

    const gutter = computed(() => props.mode == Mode.CREATE);

    function getTileModel(x: number, y: number) {
      for (const model of tileModels.value) {
        if (model.hasPosition(x, y)) return model;
      }
    }

    function selectTile(model: TileModel) {
      if (!model.isSelectable) return;
      model.select();
      setSelectableTiles();
    }

    function connectTiles() {
      for (const model of tileModels.value) {
        for (const [key, value] of model.tileRelationMap) {
          const position = model.getNeighbour(key);
          if (!value) {
            model.tileRelationMap.set(
              key,
              getTileModel(position.x, position.y)
            );
          }
        }
      }
    }

    function setSelectableTiles(): void {
      for (const model of tileModels.value) {
        model.isSelectable = false;
        if (!model.isSelected) {
          const neighbours = [...model.tileRelationMap.values()];
          if (
            neighbours.filter((neighbour) => neighbour && neighbour.isSelected)
              .length > 0
          ) {
            model.isSelectable = true;
          }
        }
      }
    }

    function updateTileModels() {
      for (let y = 0; y <= props.rows; y++) {
        for (let x = 0; x <= props.columns; x++) {
          if (!getTileModel(x, y)) {
            tileModels.value.push(new TileModel(new Vector2(x, y)));
          }
        }
      }
      connectTiles();
    }

    function setStartTile(model: TileModel) {
      if (!model.isSelected) return;
      model.isStart = true;
    }

    function setEndTile(model: TileModel) {
      if (!model.isSelected) return;
      model.isEnd = true;
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
        }
      }
    }

    watch([props.rows, props.columns], () => {
      updateTileModels();
    });

    return { tileModels, getTileModel, onClick, gutter };
  },
});
</script>

<style lang="scss" scoped>
.labyrinth-builder {
  @include flex-center();
  flex-direction: column;
  flex-wrap: wrap;
  min-width: 100%;
  min-height: 100vh;
}

.row {
  @include flex-center();
  flex-wrap: nowrap;
  min-width: 100%;
  height: auto;
}
</style>
