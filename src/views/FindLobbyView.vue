<template>
  <h1>Platzhalter Logo</h1>
  <section>
    <h2>Spiel finden</h2>
    <div class="button-wrapper">
      <input type="text" v-model="lobbyKey" />
      <button @click="join">Spiel beitreten</button>
    </div>
    <span class="error" v-if="errorMessage">{{ errorMessage }}</span>
  </section>
  <section>
    <h2>Spiel erstellen</h2>
    <button @click="createLobby(username)">Spiel erstellen</button>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useLoginStore } from "@/service/login/LoginStore";
import { useLobbyService } from "@/service/LobbyService";

export default defineComponent({
  name: "FindLobby",
  setup() {
    const { loginState } = useLoginStore();
    const { joinLobby, createLobby } = useLobbyService();

    const errorMessage = ref("");
    const lobbyKey = ref("");

    function join() {
      joinLobby(lobbyKey.value, loginState.username).catch(
        (error) => (errorMessage.value = error.message)
      );
    }

    return {
      join,
      createLobby,
      lobbyKey,
      errorMessage,
      username: loginState.username,
    };
  },
});
</script>

<style lang="scss" scoped>
h1 {
  margin: $spacing-l 0;
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

.error {
  color: darkred;
}
</style>
