<template>
  <transition name="fade" appear>
    <div class="flex-container">
      <section>
        <div class="column-wrapper">
          <h1>Gespeichert</h1>
          <p>Dein Labyrinth wurde gespeichert unter der ID {{ id }}</p>
          <transition name="delay-slow-fade" appear>
            <router-link
              to="/find"
              class="button button--small button--pulse button--filled"
            >
              Jetzt spielen
            </router-link>
          </transition>
        </div>
      </section>
    </div>
  </transition>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useBuildService } from "@/service/labyrinth/build/BuildService";

export default defineComponent({
  /** simple component for testing builder */
  name: "SaveLabyrinthView",
  setup() {
    const { buildState } = useBuildService();
    const id = computed(() => buildState.id);
    
    return { id };
  },
});
</script>

<style lang="scss" scoped>
a {
  color: $color-white;
  font-size: 18px;
  display: flex;
  margin-top: 40px;
  font-weight: 300;
  align-items: center;
  justify-content: center;
  text-decoration: none;

  @include color-scheme(dark) {
    color: $color-black;
    &:hover {
      color: $color-green;
    }
  }
}
</style>
