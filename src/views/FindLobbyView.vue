<template>
  <h1>Platzhalter Logo</h1>
  <form class="login__form">
    <ul>
      <li>
        Spiel finden <input type="text" v-model="lobbyKey" />
        <button type="button" @click="joinGame">OK</button>
      </li>
      <li>
        Spiel erstellen
        <button type="button" @click="createGame">Spiel erstellen</button>
      </li>
    </ul>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import router from "@/router";
import { useLoginStore } from "@/service/LoginStore";

export default defineComponent({
  name: "FindLobby",
  setup() {
    const loginState = useLoginStore();
    const lobbyKey = ref("");

    function joinGame() {
      let key = lobbyKey.value;
      fetch("/api/lobby/join/" + key, {
        method: "POST",
        headers: {
          "Content-Type": "html/text;charset=utf-8",
        },
        body: loginState.loginState.username,
      }).then((response) => {
        if (response.ok) {
          router.push("/lobby/" + key);
        } else {
          console.log(response.statusText);
        }
      });
    }
    function createGame() {
      console.log(loginState.loginState.username);
      fetch("/api/lobby/create", {
        method: "POST",
        headers: {
          "Content-Type": "html/text;charset=utf-8",
        },
        body: loginState.loginState.username,
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
h1 {
  border: 1px solid black;
  padding: 1em;
}

ul {
  list-style-type: none;
}

li {
  margin: 1em;
}
</style>
