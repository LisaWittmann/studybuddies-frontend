<template>
  <div v-if="nameMode" class="column-wrapper labyrinth-name-mode">
    <h1>Labyrinth benennen</h1>
    <input
      class="input--small"
      type="text"
      v-model="labyrinthName"
      @change="updateName"
    />
  </div>
  <div v-else class="labyrinth-canvas">
    <TileModelComponent
      v-for="tileModel of tileModels"
      :key="tileModel"
      :size="tileSize"
      :gutter="gutter"
      :model="tileModel"
      @clicked="onClick"
      @entered="onEnter"
      @clicked-right="onRightClick"
    />
    <TileModelOverviewComponent v-if="showTileOverview" :model="clickedTile" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useEditorService } from "@/service/editor/EditorService";
import { ItemModel, TileModel } from "@/service/editor/TileModel";
import { Mode } from "@/service/editor/EditorMode";

import TileModelComponent from "@/components/editor/TileModelComponent.vue";
import TileModelOverviewComponent from "@/components/editor/TileModelOverviewComponent.vue";

export default defineComponent({
  name: "EditorStageComponent",
  components: {
    TileModelComponent,
    TileModelOverviewComponent,
  },
  props: {
    tileModels: {
      type: Array,
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
      editorState,
      addTile,
      removeTile,
      addStartTile,
      addEndTile,
      addRestriction,
      addItem,
      setName,
    } = useEditorService();

    let mousedown = false;
    addEventListener("mousedown", () => (mousedown = true));
    addEventListener("mouseup", () => (mousedown = false));

    const gutter = computed(() => props.mode == Mode.CREATE);

    const nameMode = computed(() => props.mode == Mode.LABYRINTH_NAME);
    const labyrinthName = ref(editorState.labyrinthName);

    const clickedTile = ref({} as TileModel);
    const showTileOverview = computed(
      () =>
        clickedTile.value.objectsInRoom != undefined &&
        clickedTile.value.restrictions != undefined &&
        clickedTile.value.hasChanges()
    );

    const onEnter = (model: TileModel) => {
      if (
        mousedown &&
        (props.mode == Mode.CREATE || props.mode == Mode.RESTRICTION_PLACEMENT)
      )
        onClick(model);
      return;
    };

    const onClick = (model: TileModel) => {
      clickedTile.value = model;
      switch (props.mode) {
        case Mode.CREATE: {
          addTile(model);
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

    const onRightClick = (model: TileModel) => {
      removeTile(model);
    };

    function updateName() {
      setName(labyrinthName.value);
    }

    return {
      gutter,
      nameMode,
      clickedTile,
      showTileOverview,
      labyrinthName,
      updateName,
      onClick,
      onEnter,
      onRightClick,
    };
  },
});
</script>

<style lang="scss" scoped>
.labyrinth-name-mode {
  height: 100%;
}
.labyrinth-canvas {
  display: grid;
  justify-content: flex-start;
  min-width: 100%;
  margin: auto;

  .tile-overview {
    position: absolute;
    z-index: 1;
    top: 30px;
    left: 0;
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
