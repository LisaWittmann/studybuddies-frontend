<template>
  <transition name="fade" appear>
    <div class="container">
      <h1>
        Lobby
        <span class="uppercase"> {{ lobbyKey }}</span>
      </h1>
      <section>
        <UserListComponent :users="users" />
      </section>
      <section>
        <h2>Rolle auswählen:</h2>
        <div class="roles">
          <span v-if="selected">{{ selected }}</span>
        </div>
        <RadioButtonGroupComponent
          :options="roles"
          v-model="selected"
          @clicked="selectRole"
          :selectable="roleOptions"
        />
      </section>
      <section>
        <h2>Labyrinth auswählen:</h2>
        <DropdownComponent
          :items="labyrinthOptions"
          @select="selectLabyrinth"
        />
      </section>
      <section>
        <div class="column-wrapper">
          <transition name="fade" appear>
            <button
              class="button--small button__confirm"
              @click="readyCheck(loginState.username, selectedLabyrinth)"
            >
              Bereit
            </button>
          </transition>
          <transition name="delay-fade" appear>
            <button
              class="button button--small button__exit"
              @click="exitLobby(lobbyKey, loginState.username)"
            >
              Verlassen
            </button>
          </transition>
        </div>
      </section>
    </div>
  </transition>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useLobbyService } from "@/service/LobbyService";
import { useLoginStore } from "@/service/login/LoginStore";
import DropdownComponent from "@/components/DropdownComponent.vue";
import UserListComponent from "@/components/UserListComponent.vue";
import router from "@/router";
import { useGameStore } from "@/service/game/GameStore";
import RadioButtonGroupComponent from "@/components/RadioButtonGroupComponent.vue";

export default defineComponent({
  name: "LobbySettingsView",
  components: {
    UserListComponent,
    DropdownComponent,
    RadioButtonGroupComponent,
  },
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
      updateRole,
      getRoles,
      getRoleOptions,
    } = useLobbyService();
    const { gameState, setLobbyKey } = useGameStore();
    const labyrinthOptions = computed(() => lobbyState.labyrinthOptions);
    const selectedLabyrinth = computed(() => lobbyState.selectedLabyrinth);
    const users = computed(() => lobbyState.users);
    const lobbyKey = computed(() => gameState.lobbyKey);

    //Radiobutton data
    const allRoles = ref([]);
    const openRoles = computed(() => lobbyState.openRoles);
    let selectedRole = computed(() => lobbyState.selectedRole);

    function selectLabyrinth(id: number) {
      sessionStorage.setItem("selectedLabyrinth", JSON.stringify(id));
      updateLabyrinthPick(id, gameState.lobbyKey);
    }

    function selectRole(name: string) {
      sessionStorage.setItem("chosenRole", JSON.stringify(name));
      updateRole(name, gameState.lobbyKey, loginState.username);
    }

    onMounted(() => {
      const route = router.currentRoute.value;
      setLobbyKey(route.params.key as string);
      if (sessionStorage.getItem("lobbyKey") == gameState.lobbyKey) {
        setLobbyState(
          sessionStorage.getItem("users"),
          sessionStorage.getItem("selectedLabyrinth"),
          sessionStorage.getItem("labyrinthOptions"),
          sessionStorage.getItem("errormessage"),
          sessionStorage.getItem("chosenRole")
        );
      } else {
        sessionStorage.setItem("lobbyKey", gameState.lobbyKey);
      }
      updateLabyrinths();
      updateUsers(gameState.lobbyKey);
      getRoles(gameState.lobbyKey).then((data) => (allRoles.value = data));
      getRoleOptions(gameState.lobbyKey);
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
  padding-top: $spacing-l;
  margin-top: 0;

  span {
    font-weight: inherit;
  }
}
</style>
