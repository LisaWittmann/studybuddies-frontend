<template>
  <div class="editor">
    <transition name="delay-fade" appear>
      <div class="editor__zoom">
        <button class="button__icon" :disabled="zoomInDisabled" @click="zoomIn">
          <i class="fas fa-search-plus"></i>
        </button>
        <button
          class="button__icon"
          :disabled="zoomOutDisabled"
          @click="zoomOut"
        >
          <i class="fas fa-search-minus"></i>
        </button>
        <button class="button__icon" @click="openInstruction">
          <i class="fas fa-question-circle"></i>
        </button>
      </div>
    </transition>
    <transition name="delay-fade" appear>
      <div class="editor__tool">
        <EditorToolComponent
          v-if="restrictionMode"
          :options="roleOptions"
          :selected="currentRole"
          @select="changeRole"
        />
        <EditorToolComponent
          v-if="itemsMode && itemOptions.length > 0"
          :options="itemOptions"
          :selected="itemOptions.indexOf(currentItem)"
          @select="changeItem"
        />
      </div>
    </transition>
    <transition name="fade" appear>
      <div class="editor__stage">
        <EditorStageComponent
          :tile-models="tileModels"
          :tile-size="tileSize"
          :mode="currentMode"
          :role="currentRole"
          :item="currentItem"
        />
        <span class="error" v-if="errorMessage">{{ errorMessage }}</span>
      </div>
    </transition>
    <transition name="delay-fade" appear>
      <div class="editor__steps">
        <PaginationComponent
          :items="modes"
          :active-index="modes.indexOf(currentMode)"
          @select="changeMode"
          @complete="onComplete"
        />
      </div>
    </transition>
  </div>
  <OverlayInstructionComponent
    :opened="showInstruction"
    :text="instruction"
    @close="closeInstruction"
  />
</template>

<script lang="ts">
import { computed, defineComponent, onUnmounted, ref, watch } from "vue";
import { useAppService } from "@/service/AppService";
import { useEditorService } from "@/service/editor/EditorService";
import { ItemModel } from "@/service/editor/TileModel";
import { Mode } from "@/service/editor/EditorMode";
import { Role } from "@/service/game/Player";
import { instructions } from "@/service/editor/EditorConstants";

import OverlayInstructionComponent from "@/components/overlays/OverlayInstructionComponent.vue";
import EditorStageComponent from "@/components/editor/EditorStageComponent.vue";
import EditorToolComponent from "@/components/editor/EditorToolComponent.vue";
import PaginationComponent from "@/components/PaginationComponent.vue";

export default defineComponent({
  name: "EditorView",
  components: {
    EditorStageComponent,
    EditorToolComponent,
    PaginationComponent,
    OverlayInstructionComponent,
  },
  setup() {
    const {
      editorState,
      updateTileModels,
      setItemOptions,
      hasErrors,
      saveLabyrinth,
      resetEditorState,
    } = useEditorService();
    const { setFeedback, setFeedbackError } = useAppService();

    const modes = new Array<Mode>(
      Mode.CREATE,
      Mode.START_TILES,
      Mode.END_TILE,
      Mode.RESTRICTION_PLACEMENT,
      Mode.ITEM_PLACEMENT,
      Mode.LABYRINTH_NAME
    );
    const currentMode = ref(Mode.CREATE);
    const changeMode = (mode: Mode) => (currentMode.value = mode);

    const tileSize = ref(100);
    const minZoom = 60;
    const maxZoom = 150;
    const zoomFactor = 10;

    const tileModels = computed(() => editorState.tileModels);

    const zoomOutDisabled = computed(() => tileSize.value <= minZoom);
    const zoomInDisabled = computed(() => tileSize.value >= maxZoom);
    const zoomIn = () => {
      if (!zoomInDisabled.value) tileSize.value += zoomFactor;
    };
    const zoomOut = () => {
      if (!zoomOutDisabled.value) tileSize.value -= zoomFactor;
    };

    const restrictionMode = computed(
      () => currentMode.value == Mode.RESTRICTION_PLACEMENT
    );
    const roleOptions = new Array<Role>(Role.DESIGNER, Role.HACKER);
    const currentRole = ref(0);
    const changeRole = (role: Role) => (currentRole.value = role);

    const itemsMode = computed(() => currentMode.value == Mode.ITEM_PLACEMENT);
    const itemOptions = computed(() => editorState.itemOptions);
    const currentItem = ref(new ItemModel(""));
    setItemOptions().then(() => (currentItem.value = itemOptions.value[0]));
    const changeItem = (item: ItemModel) => (currentItem.value = item);

    const showInstruction = ref(false);
    const instruction = computed(() => instructions.get(currentMode.value));
    const openInstruction = () => (showInstruction.value = true);
    const closeInstruction = () => (showInstruction.value = false);
    const errorMessage = computed(() => editorState.errorMessage);

    function onComplete() {
      const rollback = hasErrors();
      if (rollback) {
        currentMode.value = rollback;
      } else {
        saveLabyrinth()
          .then((name) => {
            setFeedback(
              "Gespeichert",
              `Dein Labyrinth wurde unter dem Namen ${name} gespeichert`,
              "/find",
              "Jetzt spielen"
            );
            resetEditorState();
          })
          .catch(() => {
            setFeedbackError(
              "Fehler",
              editorState.errorMessage,
              "Zurück zur Bearbeitung"
            );
            if (editorState.errorMessage.includes("vergeben"))
              currentMode.value = Mode.LABYRINTH_NAME;
            else currentMode.value = Mode.CREATE;
          });
      }
    }

    watch(
      () => editorState.itemOptions,
      () => {
        currentItem.value = itemOptions.value[0] as ItemModel;
      },
      { deep: true }
    );

    onUnmounted(() => {
      updateTileModels();
    });

    return {
      tileModels,
      modes,
      currentMode,
      changeMode,
      instruction,
      showInstruction,
      openInstruction,
      closeInstruction,
      restrictionMode,
      itemsMode,
      zoomIn,
      zoomOut,
      zoomInDisabled,
      zoomOutDisabled,
      tileSize,
      roleOptions,
      currentRole,
      changeRole,
      itemOptions,
      currentItem,
      changeItem,
      onComplete,
      errorMessage,
    };
  },
});
</script>

<style lang="scss" scoped>
.editor {
  width: 100%;
  height: 100vh;
  overflow: hidden;

  &__zoom {
    display: flex;
    flex-direction: column;
    position: absolute;
    z-index: 5;
    right: 0;
    margin: 20px;

    i {
      margin: 5px 10px;
    }
  }

  &__tool {
    position: absolute;
    z-index: 6;
    bottom: 100px;
    right: 0;
    font-size: $headline-xl;
    margin: 30px;
  }

  &__stage {
    span {
      position: sticky;
      bottom: 0;
      font-size: $headline-xxl;
      font-weight: 500;
      filter: drop-shadow(0 0 20px $color-black);
      @include color-scheme(dark) {
        filter: drop-shadow(0 0 20px $color-white);
      }
    }
    height: calc(100% - 100px);
    width: 100%;
    overflow: scroll;
  }

  &__steps {
    height: 100px;
    width: 100%;
    position: sticky;
    bottom: 0;
  }
}
</style>
