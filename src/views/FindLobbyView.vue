<template>
  <section>
    <img class="logo" src="@/assets/img/logo_header.png" alt="logo" />
    <h2>Spiel finden</h2>
    <div class="button-wrapper">
      <input type="text" v-model="lobbyKey" />
      <button @click="joinGame">Spiel beitreten</button>
    </div>
  </section>
  <section>
    <h2>Spiel erstellen</h2>
    <button @click="createGame">Spiel erstellen</button>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import router from "@/router";
import { useLoginStore } from "@/service/login/LoginStore";
import { useLobbyService} from "@/service/LobbyService";

export default defineComponent({
  name: "FindLobby",
  setup() {
    const { loginState } = useLoginStore();
    const { updateUsers } = useLobbyService();
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
      //console.log(loginState.username);
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
          updateUsers(jsonData.key);
          router.push("/lobby/" + jsonData.key);
        })
        .catch((err) => console.log(err));
    }

    return { lobbyKey, createGame, joinGame };
  },
});
</script>

<style lang="scss" scoped>
.logo {
  width: 80%;
  max-width: 600px;
}

button {
  margin: 10px;
  min-height: 35px;
  max-width: 200px;
  background: transparent;
  font-size: 16px;
}

input,
button {
  border: 1px solid $color-grey;
  border-radius: 8px;
  font-weight: 300;
  width: 80%;
  display: inline-block;
  padding: 10px 12px;
  cursor: pointer;
}

input {
  min-height: 20px;
  max-width: 300px;
  margin-bottom: $spacing-xs;
}

.button-wrapper {
  @include flex-center();
  flex-direction: column;
}
</style>
