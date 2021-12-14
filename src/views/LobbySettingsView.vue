<template>
  <h1>Lobby {{ lobbyKey }}</h1>
  <section>
    <UserListComponent :users="users" />
  </section>
  <section>
    <h2>Labyrinth auswählen:</h2>
    <DropdownComponent :items="labyrinthOptions" @select="selectLabyrinth" />
  </section>
  <section>
    <div class="button-wrapper">
      <button class="button button--confirm" @click="readyCheck(loginState.username, selectedLabyrinth)">Bereit</button>
      <button
        class="button button--exit"
        @click="exitLobby(lobbyKey, username)"
      >
        Verlassen
      </button>
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useLobbyService } from "@/service/LobbyService";
import { useLoginStore } from "@/service/login/LoginStore";
import DropdownComponent from "@/components/DropdownComponent.vue";
import UserListComponent from "@/components/UserListComponent.vue";
import router from "@/router";
import {useGameStore} from "@/service/game/GameStore";

export default defineComponent({
  name: "LobbySettingsView",
  components: { UserListComponent, DropdownComponent },
  setup() {
    const { loginState } = useLoginStore();
    const {
      updateUsers,
      updateLabyrinths,
      readyCheck,
      exitLobby,
    } = useLobbyService();
    const { gameState, setLobbyKey } = useGameStore();

    const users = ref(new Array<string>());
    const labyrinthOptions = ref(new Array<number>());
    const selectedLabyrinth = ref();

    updateLabyrinths().then((data) => (labyrinthOptions.value = data));

    function selectLabyrinth(id: number) {
      selectedLabyrinth.value = id;
    }

    onMounted(() => {
      const route = router.currentRoute.value;
      setLobbyKey(route.params.key as string);
      updateUsers(gameState.lobbyKey).then((data) => (users.value = data));
    })

    const lobbyKey = computed(() => gameState.lobbyKey);

    return {
      readyCheck,
      selectLabyrinth,
      exitLobby,
      users,
      lobbyKey,
      labyrinthOptions,
      selectedLabyrinth,
      loginState,
    };
  },
});
</script>

<style lang="scss" scoped>
h1 {
  margin: $spacing-l 0;
}

.button-wrapper {
  @include flex-center();
  flex-direction: column;
}

.button {
  margin: 10px;
  min-height: 35px;
  background: transparent;
  font-size: 16px;

  &:hover {
    font-weight: 400;
  }

  &--exit {
    &:hover,
    &:active {
      color: darkred;
    }
  }

  &--confirm {
    &:hover,
    &:active {
      color: $color-green;
    }
  }
}

input[type="file"] {
  display: none;
}

.file-upload,
.button {
  border: 1px solid $color-grey;
  border-radius: 8px;
  font-weight: 300;
  display: inline-block;
  padding: 10px 12px;
  width: 80%;
  max-width: 200px;
  cursor: pointer;
}

.file-upload:hover {
  color: $color-beige;
  font-weight: 400;
}
</style>
