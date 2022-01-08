<template>
  <div v-if="nameMode" class="column-wrapper labyrinth-name-mode">
      <h1>Labyrinth benennen</h1>
      <input class="input--small" type="text" v-model="labyrinthName" @change="updateName"/>
  </div>
  <div v-else class="labyrinth-canvas">
    <div class="labyrinth-canvas__row" v-for="row in rows" :key="row">
      <BuildTileComponent
        v-for="column in columns"
        :key="column"
        :size="tileSize"
        :gutter="gutter"
        :model="getTileModel(column, row)"
        @clicked="onClick"
        @entered="onEnter"
      />
    </div>
    <BuildTileOverviewComponent v-if="showTileOverview" :model="clickedTile" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useBuildService } from "@/service/labyrinth/build/BuildService";
import { ItemModel, TileModel } from "@/service/labyrinth/build/TileModel";
import { Mode } from "@/service/labyrinth/build/BuildMode";

import BuildTileComponent from "@/components/build/BuildTileComponent.vue";
import BuildTileOverviewComponent from "@/components/build/BuildTileOverviewComponent.vue";

export default defineComponent({
  name: "BuildLabyrinthComponent",
  components: {
    BuildTileComponent,
    BuildTileOverviewComponent,
  },
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
      addStartTile,
      addEndTile,
      selectTile,
      addRestriction,
      addItem,
      setName
    } = useBuildService();

    let mousedown = false;
    addEventListener("mousedown", () => (mousedown = true));
    addEventListener("mouseup", () => (mousedown = false));

    const rows = computed(() => buildState.rows);
    const columns = computed(() => buildState.columns);
    const gutter = computed(() => props.mode == Mode.CREATE);
    const nameMode = computed(() => props.mode == Mode.LABYRINTH_NAME);

    const labyrinthName = ref(buildState.labyrinthName);

    const clickedTile = ref({} as TileModel);
    const showTileOverview = computed(
      () =>
        clickedTile.value.objectsInRoom != undefined &&
        clickedTile.value.restrictions != undefined &&
        clickedTile.value.hasChanges()
    );

    const onEnter = (model: TileModel) => {
      if (props.mode != Mode.CREATE && props.mode != Mode.RESTRICTION_PLACEMENT) return;
      if (mousedown) onClick(model);
    };

    const onClick = (model: TileModel) => {
      clickedTile.value = model;
      switch (props.mode) {
        case Mode.CREATE: {
          selectTile(model);
          break;
        }
        case Mode.START_TILES: {
          addStartTile(model);
          break;
        }
        case Mode.END_TILE: {
          addEndTile(model);
          break;
        }
        case Mode.RESTRICTION_PLACEMENT: {
          addRestriction(model, props.role);
          break;
        }
        case Mode.ITEM_PLACEMENT: {
          addItem(model, props.item);
          break;
        }
      }
    };

    function updateName() {
      setName(labyrinthName.value);
    }

    return {
      rows,
      columns,
      gutter,
      nameMode,
      clickedTile,
      showTileOverview,
      labyrinthName,
      updateName,
      getTileModel,
      onClick,
      onEnter,
    };
  },
});
</script>

<style lang="scss" scoped>
.labyrinth-name-mode {
  height: 100%;
}
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

  .tile-overview {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    bottom: 100px;
    margin-top: auto;
    margin-bottom: auto;
  }

  h1 {
    padding-top: $spacing-l;
    margin-top: 0;

    span {
      font-weight: inherit;
    }
  }
}
</style>
