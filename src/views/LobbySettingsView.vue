<template>
  <div class="container">
    <h1>Lobby {{ lobbyKey }}</h1>
    <section>
      <UserListComponent :users="users" />
    </section>
    <section>
      <h2>Rolle auswählen:</h2>
      <div class="roles">
        <span v-if="selected">{{ selected }}</span>
      </div>
      <RadioButtonGroup
        :options="roles"
        v-model="selected"
        @clicked="selectedRole"
        :selectable="roleOptions"
      />
    </section>
    <section>
      <h2>Labyrinth auswählen:</h2>
      <DropdownComponent :items="labyrinthOptions" @select="selectLabyrinth" />
    </section>
    <section>
      <div class="column-wrapper">
        <button
          class="button--small button--filled"
          @click="readyCheck(loginState.username, selectedLabyrinth)"
        >
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
import { computed, defineComponent, onMounted, ref } from "vue";
import { useLobbyService } from "@/service/LobbyService";
import { useLoginStore } from "@/service/login/LoginStore";
import DropdownComponent from "@/components/DropdownComponent.vue";
import UserListComponent from "@/components/UserListComponent.vue";
import router from "@/router";
import { useGameStore } from "@/service/game/GameStore";
import RadioButtonGroup from "@/components/RadioButtonGroup.vue";
import { onBeforeRouteLeave } from "vue-router";

export default defineComponent({
  name: "LobbySettingsView",
  components: { UserListComponent, DropdownComponent, RadioButtonGroup },
  setup() {
    //Radiobutton data
    const allRoles = ref([]);
    const openRoles = ref([]);
    let selectedRole = ref("");

    const { loginState } = useLoginStore();
    const {
      updateUsers,
      readyCheck,
      exitLobby,
      updateLabyrinthPick,
      updateLabyrinths,
      setLobbyState,
      lobbyState,
      updateRole,
      getRoles,
      getRoleOptions,
    } = useLobbyService();
    const { gameState, setLobbyKey } = useGameStore();
    const labyrinthOptions = computed(() => lobbyState.labyrinthOptions);
    const selectedLabyrinth = computed(() => lobbyState.selectedLabyrinth);
    const users = computed(() => lobbyState.users);
    const lobbyKey = computed(() => gameState.lobbyKey);

    function selectLabyrinth(id: number) {
      sessionStorage.setItem("selectedLabyrinth", JSON.stringify(id));
      updateLabyrinthPick(id, lobbyKey.value);
    }

    function selectRole(name: string) {
      sessionStorage.setItem("chosenRole", JSON.stringify(name));
      selectedRole.value = name;
      updateRole(name, gameState.lobbyKey, loginState.username).then(() => {
        getRoleOptions(gameState.lobbyKey).then((data) => {
          openRoles.value = data;
        });
      });
    }

    // open dialog before unload
    onbeforeunload = () => {
      if (lobbyState.users.includes(loginState.username)) {
        exitLobby(lobbyKey.value, loginState.username);
      }
      return "Leaving Lobby";
    };
    // exit lobby on unload
    onunload = () => {
      if (lobbyState.users.includes(loginState.username)) {
        exitLobby(lobbyKey.value, loginState.username);
      }
    };

    // exit lobby if any other page than game is opened
    onBeforeRouteLeave((to) => {
      const nextKey = to.params.key as string;
      if (nextKey != gameState.lobbyKey && lobbyState.users.includes(loginState.username)) {
        exitLobby(lobbyKey.value, loginState.username);
      }
    });

    onMounted(() => {
      const route = router.currentRoute.value;
      setLobbyKey(route.params.key as string);
      if (sessionStorage.getItem("lobbyKey") == lobbyKey.value) {
        setLobbyState(
          sessionStorage.getItem("users"),
          sessionStorage.getItem("selectedLabyrinth"),
          sessionStorage.getItem("labyrinthOptions"),
          sessionStorage.getItem("errormessage")
        );
        selectedRole.value = sessionStorage.getItem("chosenRole") as string;
      } else {
        sessionStorage.setItem("lobbyKey", lobbyKey.value);
      }
      updateLabyrinths();
      updateUsers(gameState.lobbyKey).then(() => {
        // redirect to lobby find view if user is not in lobby
        if (lobbyState.users.includes(loginState.username)) {
          router.push("/find");
        }
      });
      getRoles(gameState.lobbyKey).then((data) => (allRoles.value = data));
      getRoleOptions(gameState.lobbyKey).then(
        (data) => (openRoles.value = data)
      );
    });

    return {
      selected: selectedRole,
      readyCheck,
      selectLabyrinth,
      exitLobby,
      selectRole,
      roles: allRoles,
      roleOptions: openRoles,
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
