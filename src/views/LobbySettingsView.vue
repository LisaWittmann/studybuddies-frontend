<template>
  <div class="container">
    <h1>Lobby {{ lobbyKey }}</h1>
    <section>
      <p>{{ users.length }}/2 Spieler verbunden</p>
      <UserListComponent :users="users" :isReady="isReady" />
    </section>
    <section>
      <h2>Labyrinth auswählen:</h2>
      <DropdownComponent :items="labyrinthOptions" @select="selectLabyrinth" />
    </section>
    <section>
      <div class="column-wrapper">
        <button
          :class="{ 'button--ready': isReady }"
          class="button--small button--filled"
          @click="readyCheck(loginState.username, selectedLabyrinth)"
        >
          Bereit
        </button>
        <button
          class="button button--small button--exit"
          @click="exitLobby(lobbyKey, username)"
        >
          Verlassen
        </button>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useLobbyService } from "@/service/LobbyService";
import { useLoginStore } from "@/service/login/LoginStore";
import DropdownComponent from "@/components/DropdownComponent.vue";
import UserListComponent from "@/components/UserListComponent.vue";
import router from "@/router";
import { useGameStore } from "@/service/game/GameStore";
import { User } from "@/service/login/User";

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
      setupGame,
      lobbyState,
    } = useLobbyService();
    const { gameState, setLobbyKey } = useGameStore();

    const labyrinthOptions = ref(new Array<number>());
    const selectedLabyrinth = ref();

    updateLabyrinths().then((data) => (labyrinthOptions.value = data));

    function selectLabyrinth(id: number) {
      selectedLabyrinth.value = id;
    }

    onMounted(() => {
      const route = router.currentRoute.value;
      setLobbyKey(route.params.key as string);
    });

    const users = computed(() => lobbyState.users);
    const lobbyKey = computed(() => gameState.lobbyKey);


    // toggle ready button
    const isReady = computed(() => {
      lobbyState.users.forEach(e => {
        return(e.isReady && loginState.username == e.username) ? true : false
      });

      return false
    })

    return {
      isReady,
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

.button {
  &--upload {
    min-height: 0;

    &:hover {
      color: $color-beige;
    }
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
</style>
