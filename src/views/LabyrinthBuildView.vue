<template>
  <div class="builder">
    <div class="builder__tools"></div>
    <div class="builder__stage">
      <CreateLabyrinthComponent
        :tileSize="tileSize"
        :rows="rows"
        :columns="columns"
        :mode="currentMode"
      />
    </div>
    <div class="builder__steps">
      <i
        class="fas fa-chevron-circle-left"
        :class="{ disabled: currentIndex == 0 }"
        @click="changeMode(currentIndex - 1)"
      ></i>
      <ul class="builder__steps-wrapper">
        <li
          v-for="(mode, index) in modes"
          :key="index"
          :class="{ active: isActiveMode(mode) }"
          @click="changeMode(index)"
        >
          {{ mode }}
        </li>
      </ul>
      <i
        v-if="currentIndex != modes.length - 1"
        class="fas fa-chevron-circle-right"
        @click="changeStep(currentIndex + 1)"
      ></i>
      <i v-else class="fas fa-check-circle"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { Mode } from "@/service/labyrinth/builder/Builder";
import CreateLabyrinthComponent from "@/components/builder/CreateLabyrinthComponent.vue";

export default defineComponent({
  name: "LabyrinthBuildView",
  components: { CreateLabyrinthComponent },
  setup() {
    const columns = ref(14);
    const tileSize = ref(100);
    const rows = ref(10);

    const currentMode = ref(Mode.CREATE);
    const modes = ref(new Array<Mode>());
    modes.value.push(Mode.CREATE, Mode.START, Mode.END, Mode.ZONES, Mode.ITEMS);

    const currentIndex = computed(() => modes.value.indexOf(currentMode.value));

    function isActiveMode(mode: Mode): boolean {
      return currentMode.value == mode;
    }

    function changeMode(index: number) {
      if (index >= modes.value.length || index < 0) return;
      currentMode.value = modes.value[index];
    }

    return {
      rows,
      columns,
      tileSize,
      isActiveMode,
      modes,
      currentMode,
      changeMode,
      currentIndex,
    };
  },
});
</script>

<style lang="scss" scoped>
.builder {
  width: 100%;
  min-height: 100vh;

  &__stage {
    min-height: 100%;
    min-width: 100%;
  }

  &__steps {
    @include flex-center();
    font-size: $text-xl;
    height: 100px;
    width: 100%;
    background: $color-black;
    position: sticky;
    bottom: 0;

    &-wrapper {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      flex-wrap: nowrap;
      overflow-x: scroll;
      width: 80%;
      max-width: 800px;
      scrollbar-width: none;
      margin: 0 50px;
      padding-inline-start: 0;

      &::-webkit-scrollbar {
        display: none;
      }

      > * {
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
</style>
