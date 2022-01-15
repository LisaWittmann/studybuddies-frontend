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
          :activeIndex="modes.indexOf(currentMode)"
          @select="changeMode"
          @complete="onComplete"
        />
      </div>
    </transition>
  </div>
  <OverlayFeedbackComponent
    :opened="feedback.active"
    :headline="feedback.headline"
    :subLine="feedback.subLine"
    :link="feedback.link"
    :linkText="feedback.linkText"
    :error="feedback.error"
    @close="closeFeedback"
  />
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onUnmounted,
  reactive,
  ref,
  watch,
} from "vue";
import { useEditorService } from "@/service/editor/EditorService";
import { ItemModel } from "@/service/editor/TileModel";
import { Mode } from "@/service/editor/EditorMode";
import { Role } from "@/service/game/Player";

import OverlayFeedbackComponent from "@/components/overlays/OverlayFeedbackComponent.vue";
import EditorStageComponent from "@/components/editor/EditorStageComponent.vue";
import EditorToolComponent from "@/components/editor/EditorToolComponent.vue";
import PaginationComponent from "@/components/PaginationComponent.vue";

export default defineComponent({
  name: "EditorView",
  components: {
    EditorStageComponent,
    EditorToolComponent,
    PaginationComponent,
    OverlayFeedbackComponent,
  },
  setup() {
    const {
      editorState,
      updateTileModels,
      setItemOptions,
      hasErrors,
      save,
      reset,
    } = useEditorService();

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
    setItemOptions().then(() => (currentItem.value = itemOptions.value[0]));
    const currentItem = ref(new ItemModel(""));
    const changeItem = (item: ItemModel) => (currentItem.value = item);

    const feedback = reactive({
      active: false,
      headline: "",
      subLine: "",
      error: "",
      link: "",
      linkText: "",
    });
    const errorMessage = computed(() => editorState.errorMessage);

    function onComplete() {
      const rollback = hasErrors();
      if (rollback) {
        currentMode.value = rollback;
      } else {
        save()
          .then((name) => {
            feedback.active = true;
            feedback.headline = "Gespeichert";
            feedback.subLine = `Dein Labyrinth wurde unter dem Namen ${name} gespeichert`;
            feedback.error = "";
            feedback.link = "/find";
            feedback.linkText = "Jetzt spielen";
            reset();
          })
          .catch(() => {
            feedback.active = true;
            feedback.headline = "Fehler";
            feedback.error = editorState.errorMessage;
            feedback.linkText = "Zurück zur Bearbeitung";
          });
      }
    }

    function resetFeedback() {
      feedback.active = false;
      feedback.headline = "";
      feedback.subLine = "";
      feedback.error = "";
      feedback.link = "";
      feedback.linkText = "";
    }

    function closeFeedback() {
      if (editorState.errorMessage.includes("vergeben"))
        currentMode.value = Mode.LABYRINTH_NAME;
      else currentMode.value = Mode.CREATE;
      resetFeedback();
    }

    watch(
      () => editorState.itemOptions,
      () => {
        currentItem.value = itemOptions.value[0];
      },
      { deep: true }
    );

    onUnmounted(() => {
      updateTileModels();
      feedback.active = false;
    });

    return {
      modes,
      currentMode,
      changeMode,
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
      feedback,
      errorMessage,
      closeFeedback,
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
