<template>
  <div class="container">
    <h1>Lobby {{ lobbyKey }}</h1>
    <section>
      <UserListComponent :users="users" />
    </section>
    <section>
      <h2>Labyrinth auswählen:</h2>
      <DropdownComponent :items="labyrinthOptions" @select="selectLabyrinth" />
    </section>
    <section>
      <div class="column-wrapper">
        <button class="button--small button--filled" @click="readyCheck(loginState.username, selectedLabyrinth)">
          Bereit
        </button>
        <button
          class="button button--small button--exit"
          @click="exitLobby(lobbyKey, loginState.username)"
        >
          Verlassen
        </button>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted} from "vue";
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
      readyCheck,
      exitLobby,
      updateLabyrinthPick,
      updateLabyrinths,
      setLobbyState,
      lobbyState,
    } = useLobbyService();
    const { gameState, setLobbyKey } = useGameStore();



    const labyrinthOptions = computed(() => lobbyState.labyrinthOptions);
    const selectedLabyrinth = computed(() => lobbyState.selectedLabyrinth);
    const users = computed(() => lobbyState.users);
    const lobbyKey = computed(() => gameState.lobbyKey);

    function selectLabyrinth(id: number) {
      updateLabyrinthPick(id, lobbyKey.value);
    }

    onBeforeUnmount(() => {
      sessionStorage.setItem("lobbyKey", lobbyKey.value);
      sessionStorage.setItem("users", JSON.stringify(lobbyState.users));
      sessionStorage.setItem("selectedLabyrinth", JSON.stringify(lobbyState.selectedLabyrinth));
      sessionStorage.setItem("labyrinthOptions", JSON.stringify(lobbyState.labyrinthOptions));
      sessionStorage.setItem("errormessage", JSON.stringify(lobbyState.errormessage));
    })

    onMounted(() => {
      const route = router.currentRoute.value;
      setLobbyKey(route.params.key as string);
      if(sessionStorage.getItem("lobbyKey") == lobbyKey.value){
        setLobbyState(
          sessionStorage.getItem("users"),
          sessionStorage.getItem("selectedLabyrinth"),
          sessionStorage.getItem("labyrinthOptions"),
          sessionStorage.getItem("errormessage"),
          );
      }
      updateLabyrinths();
      updateUsers(gameState.lobbyKey);
    })

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
