<template>
  <OverlayComponent :opened="opened">
    <transition name="fade" appear>
      <div class="flex-container">
        <section>
          <div class="column-wrapper">
            <h1>{{ headline }}</h1>
            <span class="error" v-if="error">{{ error }}</span>
            <span v-else>{{ subLine }}</span>
            <transition name="delay-slow-fade" appear>
              <router-link
                :to="link"
                @click="onClick"
                class="button button--small button--pulse button--filled"
              >
                {{ linkText }}
              </router-link>
            </transition>
          </div>
        </section>
      </div>
    </transition>
  </OverlayComponent>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import OverlayComponent from "@/components/overlays/OverlayComponent.vue";
import router from "@/router/index";

export default defineComponent({
  name: "OverlayFeedbackComponent",
  components: { OverlayComponent },
  props: {
    opened: {
      type: Boolean,
      required: true,
    },
    headline: {
      type: String,
      required: true,
    },
    subLine: {
      type: String,
      required: false,
    },
    error: {
      type: String,
      required: false,
    },
    link: {
      type: String,
      default: "/find",
    },
    linkText: {
      type: String,
      default: "Jetzt spielen",
    },
  },
  setup(props, context) {
    const onClick = () => {
      context.emit("close");
      if (!props.error) router.push(props.link);
    };
    return { onClick };
  },
});
</script>

<style lang="scss" scoped>
.overlay {
  background: $color-white;
  color: $color-black;
  @include color-scheme(dark) {
    background: $color-black-background;
    color: $color-white;
  }
}

a {
  margin-top: 40px;
}
</style>
