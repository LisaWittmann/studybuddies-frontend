<template>
  <OverlayComponent :opened="opened">
    <div class="conversation">
      <div class="conversation__content">
        <p>{{ message.text }}</p>
      </div>
      <div class="conversation__option-wrapper">
        <div
            class="conversation__option"
            v-for="response of message.responses"
            :key="response.redirect"
            :style="{ flexBasis: 100 / message.responses.length + '%' }"
            @click="clickOption(response.redirect)"
        >
          {{ response.text }}
        </div>
      </div>
    </div>
  </OverlayComponent>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import OverlayComponent from "@/components/overlays/OverlayComponent.vue";
import { Message } from "@/service/game/Conversation";

export default defineComponent({
  name: "OverlayConversationComponent",
  components: { OverlayComponent },
  props: {
    opened: {
      type: Boolean,
      required: true,
    },
    message: {
      type: Message,
      required: true,
    },
  },
  setup(props, { emit }) {
    function clickOption(id: string) {
      console.log(id);
      emit("respond", id);
    }

    return { clickOption };
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