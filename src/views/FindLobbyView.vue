<template>
  <div class="container">
    <section>
      <img
        class="image--header"
        src="@/assets/img/logo_header.png"
        alt="logo"
      />
      <h2>Spiel finden</h2>
      <div class="column-wrapper">
        <input class="input--small" type="text" v-model="lobbyKey" />
        <button class="button--small" @click="joinGame">Spiel beitreten</button>
      </div>
    </section>
    <section>
      <h2>Spiel erstellen</h2>
      <button class="button--small" @click="createGame">Spiel erstellen</button>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useLoginStore } from "@/service/login/LoginStore";
import router from "@/router";

export default defineComponent({
  name: "FindLobby",
  setup() {
    const { loginState } = useLoginStore();
    const lobbyKey = ref("");

    function joinGame() {
      let key = lobbyKey.value;
      fetch("/api/lobby/join/" + key, {
        method: "POST",
        headers: {
          "Content-Type": "html/text;charset=utf-8",
        },
        body: loginState.username,
      }).then((response) => {
        if (response.ok) {
          router.push("/lobby/" + key);
        } else {
          console.log(response.statusText);
        }
      });
    }

    function createGame() {
      console.log(loginState.username);
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

    return { lobbyKey, createGame, joinGame };
  },
});
</script>

<style lang="scss" scoped>
.image--header {
  width: 80%;
  max-width: 600px;
}
</style>
