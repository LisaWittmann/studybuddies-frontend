<template>
  <transition name="fade" appear>
    <div class="container">
      <img class="image--header" :src="header" alt="logo" />
      <section>
        <h2>Spiel finden</h2>
        <div class="column-wrapper">
          <input
            class="input--small uppercase"
            type="text"
            v-model="lobbyKey"
          />
          <button class="button--small" @click="joinGame">
            Spiel beitreten
          </button>
        </div>
        <span class="error" v-if="errorMessage">{{ errorMessage }}</span>
      </section>
      <transition name="delay-fade">
        <section>
          <h2>Spiel erstellen</h2>
          <button class="button--small" @click="createGame">
            Spiel erstellen
          </button>
        </section>
      </transition>
      <transition name="delay-slow-fade" appear>
        <section>
          <h2>Labyrinth erstellen</h2>
          <button class="button--small" @click="createLabyrinth">
            Labyrinth erstellen
          </button>
        </section>
      </transition>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useLoginStore } from "@/service/login/LoginStore";
import router from "@/router";

export default defineComponent({
  name: "FindLobby",
  setup() {
    const { loginState } = useLoginStore();
    const lobbyKey = ref("");
    const errorMessage = ref("");

    const header = computed(() => {
      if (matchMedia("(prefers-color-scheme: dark)").matches)
        return require("@/assets/img/logo_header_dark.png");
      return require("@/assets/img/logo_header.png");
    });

    function joinGame() {
      let key = lobbyKey.value;
      fetch("/api/lobby/join/" + key, {
        method: "POST",
        headers: {
          "Content-Type": "html/text;charset=utf-8",
        },
        body: loginState.username,
      }).then((response) => {
        if (response.ok) router.push("/lobby/" + key);
        else if (response.status == 409) errorMessage.value = "Lobby voll";
        else if (response.status == 404)
          errorMessage.value = "Lobby nicht gefunden";
      });
    }

    function createGame() {
      fetch("/api/lobby/create", {
        method: "POST",
        headers: {
          "Content-Type": "html/text;charset=utf-8",
        },
        body: loginState.username,
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((jsonData) => {
          router.push("/lobby/" + jsonData.key);
        })
        .catch((err) => console.log(err));
    }

    function createLabyrinth() {
      router.push("/build");
    }

    onbeforeunload = () => console.log("overriding previous listener");

    return {
      lobbyKey,
      createGame,
      createLabyrinth,
      joinGame,
      header,
      errorMessage,
    };
  },
});
</script>

<style lang="scss" scoped>
.image--header {
  width: 100%;
  max-width: 600px;
  padding-top: $spacing-l;
}
</style>
