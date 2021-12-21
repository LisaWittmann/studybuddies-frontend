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
import { computed, defineComponent, onBeforeUnmount, onMounted, ref} from "vue";
import { useLobbyService } from "@/service/LobbyService";
import { useLoginStore } from "@/service/login/LoginStore";
import DropdownComponent from "@/components/DropdownComponent.vue";
import UserListComponent from "@/components/UserListComponent.vue";
import router from "@/router";
import { useGameStore } from "@/service/game/GameStore";
import RadioButtonGroup from "@/components/RadioButtonGroup.vue";
import { Role } from "@/service/game/Player";

export default defineComponent({
  name: "LobbySettingsView",
  components: { UserListComponent, DropdownComponent, RadioButtonGroup },
  setup() {
    //Radiobutton data
    const roles = ref([]);
    const roleOptions = ref([]);
    let selected = ref("");

    const { loginState } = useLoginStore();
    const {
      updateUsers,
      readyCheck,
      exitLobby,
      updateLabyrinthPick,
      updateLabyrinths,
      setLobbyState,
      lobbyState,
      selectRole,
      getRoles,
      getRoleOptions,
    } = useLobbyService();
    const { gameState, setLobbyKey } = useGameStore();



    const labyrinthOptions = computed(() => lobbyState.labyrinthOptions);
    const selectedLabyrinth = computed(() => lobbyState.selectedLabyrinth);
    const users = computed(() => lobbyState.users);
    const lobbyKey = computed(() => gameState.lobbyKey);

    function selectLabyrinth(id: number) {
      updateLabyrinthPick(id, lobbyKey.value);
    }

    function selectedRole(name: string) {
      selected.value = name;
      selectRole(name, gameState.lobbyKey, loginState.username).then(() => {
        getRoleOptions(gameState.lobbyKey).then((data) => {
          roleOptions.value = data;
        });
      });
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
      getRoles(gameState.lobbyKey).then((data) => (roles.value = data));
      getRoleOptions(gameState.lobbyKey).then(
          (data) => (roleOptions.value = data)
      );
    });

    return {
      selected,
      readyCheck,
      selectLabyrinth,
      exitLobby,
      selectedRole,
      roles,
      roleOptions,
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
