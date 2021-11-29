<template>
  <OverlayComponent :opened="opened">
    <div class="instruction">
      <i
        v-if="showPrevButton"
        class="fas fa-chevron-left"
        @click="rewindInstruction"
      ></i>
      <div class="instruction__text">
        {{ instruction }}
      </div>
      <i
        v-if="showNextButton"
        class="fas fa-chevron-right"
        @click="skipInstruction"
      ></i>
    </div>
  </OverlayComponent>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import OverlayComponent from "@/components/OverlayComponent.vue";

export default defineComponent({
  name: "InstructionComponent",
  components: { OverlayComponent },
  props: {
    instructions: {
      type: Array,
      required: true,
    },
    timer: {
      type: Number,
      default: 5000,
    },
  },
  setup(props) {
    let timer: number;
    const index = ref(0);
    const opened = ref(true);

    const showNextButton = computed(
      () => index.value != props.instructions.length - 1
    );
    const showPrevButton = computed(() => index.value != 0);
    const instruction = computed(() => props.instructions[index.value]);

    const startTimer = () => (timer = setTimeout(toggleNext, props.timer));
    const stopTimer = () => clearTimeout(timer);
    const closeInstructions = () => (opened.value = false);

    function toggleNext(): void {
      index.value = index.value + 1;
      if (index.value >= props.instructions.length) {
        closeInstructions();
      }
      startTimer();
    }

    function rewindInstruction(): void {
      stopTimer();
      index.value = index.value - 1;
      startTimer();
    }

    function skipInstruction(): void {
      stopTimer();
      toggleNext();
    }

    onMounted(() => startTimer());

    return {
      instruction,
      opened,
      showNextButton,
      showPrevButton,
      skipInstruction,
      rewindInstruction,
    };
  },
});
</script>

<style lang="scss" scoped>
.overlay {
  cursor: pointer;
  user-select: none;

  .instruction {
    @include flex-center();
    flex-direction: row;
    font-size: $headline-xl;

    &__text {
      @include text-break();
      margin: $spacing-m;
      width: 500px;
    }
  }
}
</style>
