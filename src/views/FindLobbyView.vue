<template>
  <transition name="fade" appear>
    <div class="container">
      <img class="image--header" :src="header" alt="logo" />
      <section>
        <h2>Spiel finden</h2>
        <form class="column-wrapper" @submit.prevent="join(lobbyKey)">
          <input
            class="input--medium uppercase"
            type="text"
            v-model="lobbyKey"
          />
          <button type="submit" class="button--small">Spiel beitreten</button>
        </form>
        <span class="error" v-if="errorMessage">{{ errorMessage }}</span>
      </section>
      <transition name="delay-fade">
        <section>
          <h2>Spiel erstellen</h2>
          <button class="button--small" @click="createLobby">
            Spiel erstellen
          </button>
        </section>
      </transition>
      <transition name="delay-slow-fade" appear>
        <section>
          <h2>Labyrinth erstellen</h2>
          <button class="button--small" @click="navigateToEditor">
            Labyrinth erstellen
          </button>
        </section>
      </transition>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useLobbyService } from "@/service/lobby/LobbyService";
import router from "@/router";

export default defineComponent({
  name: "FindLobby",
  setup() {
    const { joinLobby, createLobby } = useLobbyService();

    const lobbyKey = ref("");
    const errorMessage = ref("");

    const navigateToEditor = () => router.push("/editor");
    const join = (lobbyKey: string) => {
      joinLobby(lobbyKey).catch(
        (error) => (errorMessage.value = error.message)
      );
    };

    const header = computed(() => {
      if (matchMedia("(prefers-color-scheme: dark)").matches)
        return require("@/assets/img/logo_header_dark.png");
      return require("@/assets/img/logo_header.png");
    });

    onbeforeunload = null;

    return {
      lobbyKey,
      createLobby,
      join,
      header,
      errorMessage,
      navigateToEditor,
    };
  },
});
</script>

<style lang="scss" scoped>
.image--header {
  width: 100%;
  max-width: $width-l;
  padding-top: $spacing-l;
}

input {
  text-align: center;
}
</style>
