<template>
  <OverlayComponent :opened="opened">
    <i class="far fa-times-circle button-close" @click="close"></i>
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
import OverlayComponent from "@/components/overlays/OverlayComponent.vue";

export default defineComponent({
  name: "OverlayInstructionComponent",
  components: { OverlayComponent },
  props: {
    opened: {
      type: Boolean,
      required: true,
    },
    instructions: {
      type: Array,
      required: true,
    },
    timer: {
      type: Number,
      default: 5000,
    },
  },
  setup(props, { emit }) {
    let timer: number;

    const index = ref(0);
    const instruction = computed(() => props.instructions[index.value]);

    const showPrevButton = computed(() => index.value != 0);
    const showNextButton = computed(
      () => index.value != props.instructions.length - 1
    );

    const startTimer = () => (timer = setTimeout(toggleNext, props.timer));
    const stopTimer = () => clearTimeout(timer);
    const close = () => emit("close");

    /**
     * sets current instruction to next item of instruction array
     */
    function toggleNext(): void {
      index.value = index.value + 1;
      if (index.value >= props.instructions.length) {
        emit("close");
      }
      startTimer();
    }

    /**
     * skip back to previous instruction and clear timeout
     */
    function rewindInstruction(): void {
      stopTimer();
      index.value = index.value - 1;
      startTimer();
    }

    /**
     * skip forward to next instruction and clear timeout
     */
    function skipInstruction(): void {
      stopTimer();
      toggleNext();
    }

    // start timer when components appears on screen
    onMounted(() => startTimer());

    return {
      close,
      instruction,
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

  .button-close {
    font-size: $headline-xxl;
    position: absolute;
    margin: 20px;
    right: 0;
    top: 0;
  }

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
