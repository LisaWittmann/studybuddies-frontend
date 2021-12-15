<template>
  <OverlayComponent :opened="opened">
    <div class="conversation">
      <div class="conversation__content">
        <p>{{ node.text }}</p>
      </div>
      <div class="conversation__option-wrapper">
        <div
          class="conversation__option"
          v-for="child of children"
          :key="child.key"
          :style="{ flexBasis: 100 / children.length + '%' }"
          @click="clickOption(child)"
        >
          {{ child.answer }}
        </div>
      </div>
    </div>
  </OverlayComponent>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import OverlayComponent from "@/components/overlays/OverlayComponent.vue";
import { ConversationNode } from "@/service/game/ConversationNode";

export default defineComponent({
  namae: "OverlayConversationComponent",
  components: { OverlayComponent },
  props: {
    opened: {
      type: Boolean,
      required: true,
    },
    node: {
      type: ConversationNode,
      required: true,
    },
  },
  setup(props, { emit }) {
    function clickOption(node: ConversationNode) {
      emit("select-option", node);
    }

    const children = computed(() =>
      [props.node.leftNode, props.node.rightNode].filter(
        (child) => child instanceof ConversationNode
      )
    );

    return { clickOption, children };
  },
});
</script>

<style lang="scss" scoped>
.conversation {
  width: 80%;
  max-width: 600px;
  font-size: 18px;
  color: $color-black;

  &__content {
    @include flex-center();
    background: $color-white;
    min-height: 200px;
    border-radius: 10px;
    padding: $spacing-xs $spacing-s;
  }

  &__option {
    @include flex-center();
    background: $color-light-green;
    border-radius: 10px;
    margin-right: $spacing-s;
    padding: $spacing-s;
    cursor: pointer;

    &:last-of-type {
      margin-right: 0;
    }

    &-wrapper {
      display: flex;
      flex-wrap: nowrap;
      margin-top: $spacing-m;
    }
  }
}
</style>
