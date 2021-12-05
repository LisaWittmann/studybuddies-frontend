<template>
  <h1>Platzhalter Logo</h1>
  <form class="login__form">
    <ul>
      <li>
        Spiel finden <input type="text"/>
        <button type="submit">OK</button>
      </li>
      <li>
        Spiel erstellen
        <button type="button" @click="createGame">Spiel erstellen</button>
      </li>
    </ul>
  </form>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import router from "@/router";
import {useLoginStore} from "@/service/LoginStore.ts";

export default defineComponent({
  name: "FindLobby",
  setup() {
    const loginstate = useLoginStore();

    function createGame() {
      console.log(loginstate.loginState.username);
      fetch("/api/lobby/create", {
        method: "POST",
        headers: {
          "Content-Type": "html/text;charset=utf-8",
        },
        body: loginstate.loginState.username,
      })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
          })
          .then((jsonData) => {
            console.log(jsonData);
            router.push("/lobby/" + jsonData.key);
          })
          .catch((err) => console.log(err));
    }

    return {createGame};
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
