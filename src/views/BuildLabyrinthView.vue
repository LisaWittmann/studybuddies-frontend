<template>
  <div class="builder">
    <div class="builder__zoom">
      <button class="button__icon" :disabled="zoomInDisabled" @click="zoomIn">
        <i class="fas fa-search-plus"></i>
      </button>
      <button class="button__icon" :disabled="zoomOutDisabled" @click="zoomOut">
        <i class="fas fa-search-minus"></i>
      </button>
    </div>
    <div class="builder__tool">
      <div v-if="inZoneMode" class="builder__paint">
        <div v-if="showRoleOptions" class="builder__paint-options">
          <button
            v-for="role in roleOptions"
            :key="role"
            class="builder__paint-button button__icon--circle"
            :class="{ hacker: role }"
            @click="selectRole(role)"
          >
            <i class="fas fa-fill-drip"></i>
          </button>
        </div>
        <button
          class="builder__paint-button button__icon--circle"
          @click="toggleRoleOptions"
          :class="{ hacker: selectedRole, uncolored: showRoleOptions }"
        >
          <i class="fas fa-fill-drip"></i>
        </button>
      </div>
    </div>
    <div class="builder__stage">
      <LabyrinthCanvasComponent
        :tileSize="tileSize"
        :mode="currentMode"
        :role="selectedRole"
      />
    </div>
    <div class="builder__steps">
      <button
        class="button__icon"
        :disabled="currentIndex == 0"
        @click="changeMode(currentIndex - 1)"
      >
        <i class="fas fa-chevron-circle-left"></i>
      </button>
      <ul class="builder__steps-wrapper">
        <li
          v-for="(mode, index) in modes"
          :key="index"
          :class="[{ active: isActiveMode(mode) }]"
          @click="changeMode(index)"
        >
          {{ mode }}
        </li>
      </ul>
      <button
        v-if="currentIndex != modes.length - 1"
        class="button__icon"
        @click="changeMode(currentIndex + 1)"
      >
        <i class="fas fa-chevron-circle-right"></i>
      </button>
      <button v-else class="button__icon" @click="onComplete">
        <i class="fas fa-check-circle"></i>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useBuildService } from "@/service/labyrinth/build/BuildService";
import { Mode, Role } from "@/service/labyrinth/build/BuildMode";
import LabyrinthCanvasComponent from "@/components/build/LabyrinthCanvasComponent.vue";
import router from "@/router";

export default defineComponent({
  name: "LabyrinthBuildView",
  components: { LabyrinthCanvasComponent },
  setup() {
    const { hasErrors, transform } = useBuildService();

    const modes = ref(
      new Array<Mode>(Mode.CREATE, Mode.START, Mode.END, Mode.ZONES, Mode.ITEMS)
    );

    const currentMode = ref(Mode.CREATE);
    const currentIndex = computed(() => modes.value.indexOf(currentMode.value));

    function isActiveMode(mode: Mode): boolean {
      return currentMode.value == mode;
    }

    function changeMode(index: number) {
      if (index >= modes.value.length || index < 0) return;
      currentMode.value = modes.value[index];
    }

    const tileSize = ref(100);
    const zoomOutDisabled = computed(() => tileSize.value == 50);
    const zoomInDisabled = computed(() => tileSize.value == 150);

    function zoomIn() {
      if (!zoomInDisabled.value) tileSize.value += 10;
    }

    function zoomOut() {
      if (!zoomOutDisabled.value) tileSize.value -= 10;
    }

    const inZoneMode = computed(() => currentMode.value == Mode.ZONES);
    const roleOptions = ref(new Array<Role>(Role.DESIGNER, Role.HACKER));
    const selectedRole = ref(0);
    const showRoleOptions = ref(false);

    function toggleRoleOptions() {
      showRoleOptions.value = !showRoleOptions.value;
    }

    function selectRole(role: Role) {
      selectedRole.value = role;
      showRoleOptions.value = false;
    }

    function onComplete() {
      const rollback = hasErrors();
      if (rollback) {
        currentMode.value = rollback;
      } else {
        transform();
        router.push("/save");
      }
    }

    return {
      modes,
      currentMode,
      changeMode,
      currentIndex,
      isActiveMode,
      zoomIn,
      zoomOut,
      tileSize,
      zoomInDisabled,
      zoomOutDisabled,
      inZoneMode,
      roleOptions,
      showRoleOptions,
      toggleRoleOptions,
      selectRole,
      selectedRole,
      onComplete,
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

  &__paint {
    position: absolute;
    z-index: 2;
    bottom: 100px;
    right: 0;
    font-size: $headline-xl;
    margin: 20px;

    &-button {
      background: $color-beige;
      color: $color-black;

      &.uncolored {
        background: $color-grey !important;
      }

      &.hacker {
        background: $color-green;
      }
    }

    &-options {
      margin-bottom: 20px;
      > * {
        margin: 5px 0px;
      }
    }
  }

  &__stage {
    min-height: 100%;
    min-width: 100%;
    overflow: scroll;
  }

  &__steps {
    @include flex-center();
    height: 100px;
    width: 100%;
    position: sticky;
    bottom: 0;
    background: $color-white;
    box-shadow: 0 0 15px rgba($color-black, 0.2);

    @include color-scheme(dark) {
      background: $color-black-background;
      box-shadow: 0 0 15px rgba($color-grey, 0.1);
    }

    &-wrapper {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      flex-wrap: nowrap;
      overflow-x: scroll;
      width: 70%;
      max-width: 800px;
      scrollbar-width: none;
      margin: 0 50px;
      padding-inline-start: 0;

      > * {
        font-size: $text-xl;
        white-space: nowrap;
        cursor: pointer;
        list-style: none;
        margin-left: 0px;
        margin-right: 20px;
        opacity: 0.4;

        &.active {
          opacity: 1;
        }

        &::before {
          content: "/";
          margin-right: 20px;
        }

        &.active::before {
          opacity: 0.4;
        }

        &:first-of-type::before {
          content: "";
        }
      }
    }
  }
}

::-webkit-scrollbar {
  display: none;
}
</style>
