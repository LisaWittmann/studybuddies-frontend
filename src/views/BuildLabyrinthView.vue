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
          :selected="selectedRole"
          @select="selectRole"
        />
      </div>
    </transition>
    <transition name="fade" appear>
      <div class="builder__stage">
        <LabyrinthCanvasComponent
          :tileSize="tileSize"
          :mode="currentMode"
          :role="selectedRole"
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
  />
</template>

<script lang="ts">
import { defineComponent, ref, computed, reactive, onUnmounted } from "vue";
import { useBuildService } from "@/service/labyrinth/build/BuildService";
import { Mode, Role } from "@/service/labyrinth/build/BuildMode";

import OverlayFeedbackComponent from "@/components/overlays/OverlayFeedbackComponent.vue";
import LabyrinthCanvasComponent from "@/components/build/LabyrinthCanvasComponent.vue";
import BuildToolComponent from "@/components/build/BuildToolComponent.vue";
import PaginationComponent from "@/components/PaginationComponent.vue";

export default defineComponent({
  name: "LabyrinthBuildView",
  components: {
    LabyrinthCanvasComponent,
    PaginationComponent,
    BuildToolComponent,
    OverlayFeedbackComponent,
  },
  setup() {
    const { hasErrors, convert, save, reset } = useBuildService();

    const modes = new Array<Mode>(
      Mode.CREATE,
      Mode.START,
      Mode.END,
      Mode.RESTRICTIONS
    );
    const currentMode = ref(Mode.CREATE);
    const changeMode = (mode: Mode) => (currentMode.value = mode);

    const tileSize = ref(100);
    const minZoom = 50;
    const maxZoom = 150;
    const zoomFactor = 10;

    const zoomOutDisabled = computed(() => tileSize.value == minZoom);
    const zoomInDisabled = computed(() => tileSize.value == maxZoom);

    const zoomIn = () => {
      if (!zoomInDisabled.value) tileSize.value += zoomFactor;
    };
    const zoomOut = () => {
      if (!zoomOutDisabled.value) tileSize.value -= zoomFactor;
    };

    const restrictionMode = computed(
      () => currentMode.value == Mode.RESTRICTIONS
    );

    const roleOptions = ref(new Array<Role>(Role.DESIGNER, Role.HACKER));
    const selectedRole = ref(0);
    const selectRole = (role: Role) => (selectedRole.value = role);

    const labyrinthId = ref(0);
    const feedback = reactive({
      active: false,
      headline: "",
      subline: "",
    });

    function onComplete() {
      const rollback = hasErrors();
      if (rollback) {
        currentMode.value = rollback;
      } else {
        const labyrinth = convert();
        save(labyrinth).then((id) => {
          labyrinthId.value = id;
          feedback.active = true;
          feedback.headline = "Gespeichert";
          feedback.subline = `Dein Labyrinth wurde gespeichert unter der ID ${labyrinthId.value}`;
        });
      }
    }

    onUnmounted(() => reset());

    return {
      modes,
      currentMode,
      changeMode,
      zoomIn,
      zoomOut,
      tileSize,
      zoomInDisabled,
      zoomOutDisabled,
      restrictionMode,
      roleOptions,
      selectRole,
      selectedRole,
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
    margin: 20px;
  }

  &__stage {
    min-height: 100%;
    min-width: 100%;
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
