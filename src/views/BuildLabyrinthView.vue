<template>
  <div class="builder">
    <transition name="delay-fade" appear>
      <div class="builder__zoom">
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
      <div class="builder__tool">
        <BuildToolComponent
          v-if="restrictionMode"
          :options="roleOptions"
          :selected="currentRole"
          @select="changeRole"
        />
        <BuildToolComponent
          v-if="itemsMode && itemOptions.length > 0"
          :options="itemOptions"
          :selected="itemOptions.indexOf(currentItem)"
          @select="changeItem"
        />
      </div>
    </transition>
    <transition name="fade" appear>
      <div class="builder__stage">
        <BuildLabyrinthComponent
          :tile-size="tileSize"
          :mode="currentMode"
          :role="currentRole"
          :item="currentItem"
        />
      </div>
    </transition>
    <transition name="delay-fade" appear>
      <div class="builder__steps">
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
    :subline="feedback.subline"
    :link="feedback.link"
    :linkText="feedback.linkText"
    :reload="feedback.reload"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  reactive,
  onUnmounted,
  watch,
} from "vue";
import { useBuildService } from "@/service/labyrinth/build/BuildService";
import { Mode, Role } from "@/service/labyrinth/build/BuildMode";

import OverlayFeedbackComponent from "@/components/overlays/OverlayFeedbackComponent.vue";
import BuildLabyrinthComponent from "@/components/build/BuildLabyrinthComponent.vue";
import BuildToolComponent from "@/components/build/BuildToolComponent.vue";
import PaginationComponent from "@/components/PaginationComponent.vue";
import { ItemModel } from "@/service/labyrinth/build/TileModel";

export default defineComponent({
  name: "LabyrinthBuildView",
  components: {
    BuildLabyrinthComponent,
    BuildToolComponent,
    PaginationComponent,
    OverlayFeedbackComponent,
  },
  setup() {
    const {
      buildState,
      updateTileModels,
      setItemOptions,
      hasErrors,
      convert,
      save,
      reset,
    } = useBuildService();

    const modes = new Array<Mode>(
      Mode.CREATE,
      Mode.START,
      Mode.END,
      Mode.RESTRICTIONS,
      Mode.ITEMS
    );
    const currentMode = ref(Mode.CREATE);
    const changeMode = (mode: Mode) => (currentMode.value = mode);

    const tileSize = ref(100);
    const minZoom = 50;
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
      () => currentMode.value == Mode.RESTRICTIONS
    );
    const roleOptions = new Array<Role>(Role.DESIGNER, Role.HACKER);
    const currentRole = ref(0);
    const changeRole = (role: Role) => (currentRole.value = role);

    const itemsMode = computed(() => currentMode.value == Mode.ITEMS);
    const itemOptions = computed(() => buildState.itemOptions);
    setItemOptions().then(() => (currentItem.value = itemOptions.value[0]));
    const currentItem = ref(new ItemModel(""));
    const changeItem = (item: ItemModel) => (currentItem.value = item);

    const feedback = reactive({
      active: false,
      headline: "",
      subline: "",
      link: "",
      linkText: "",
      reload: false,
    });

    function onComplete() {
      const rollback = hasErrors();
      if (rollback) {
        currentMode.value = rollback;
      } else {
        const labyrinth = convert();
        save(labyrinth)
          .then((id) => {
            feedback.active = true;
            feedback.headline = "Gespeichert";
            feedback.subline = `Dein Labyrinth wurde gespeichert unter der ID ${id}`;
            feedback.link = "/find";
            feedback.linkText = "Jetzt spielen";
            feedback.reload = false;
          })
          .catch(() => {
            feedback.active = true;
            feedback.headline = "Fehler";
            feedback.subline =
              "Leider ist etwas schief gelaufen. Bitte versuche es noch einmal";
            feedback.link = "/build";
            feedback.linkText = "Zurück";
            feedback.reload = true;
          });
      }
    }

    watch(
      () => buildState.itemOptions,
      () => {
        currentItem.value = itemOptions.value[0];
      }
    );

    onUnmounted(() => {
      reset();
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
    };
  },
});
</script>

<style lang="scss" scoped>
.builder {
  width: 100%;
  height: 100vh;
  overflow: hidden;

  &__zoom {
    display: flex;
    flex-direction: column;
    position: absolute;
    z-index: 2;
    right: 0;
    margin: 20px;
    i {
      margin: 5px 10px;
    }
  }

  &__tool {
    position: absolute;
    z-index: 2;
    bottom: 100px;
    right: 0;
    font-size: $headline-xl;
    margin: 30px;
  }

  &__stage {
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
