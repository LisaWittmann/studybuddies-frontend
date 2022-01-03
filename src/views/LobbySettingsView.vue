<template>
  <transition name="fade" appear>
    <div class="container">
      <h1>
        Lobby
        <span class="uppercase"> {{ lobbyKey }}</span>
      </h1>
      <section>
        <p>{{ users.length }}/2 Spieler verbunden</p>
        <UserListComponent :users="users" />
      </section>
      <section>
        <h2>Rolle auswählen:</h2>
        <div class="roles">
          <span v-if="selectedRole">{{ selectedRole }}</span>
        </div>
        <RadioButtonGroupComponent
          :options="allRoles"
          v-model="selectedRole"
          @clicked="selectRole"
          :selectable="openRoles"
        />
      </section>
      <section>
        <h2>Labyrinth auswählen:</h2>
        <DropdownComponent
          :items="labyrinthOptions"
          :selectedItem="selectedLabyrinth"
          @select="selectLabyrinth"
        />
      </section>
      <section>
        <div class="column-wrapper">
          <transition name="fade" appear>
            <button
              :class="{ button__ready: isReady }"
              class="button--small"
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
import { onBeforeRouteLeave } from "vue-router";

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
      setLabyrinthSelection,
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
    const selectedRole = computed(() => lobbyState.selectedRole);

    //ReadyState data
    const isReady = computed(
      () =>
        lobbyState.users.find((user) => user.username === loginState.username)
          ?.isReady
    );

    function selectLabyrinth(id: number) {
      setLabyrinthSelection(id);
      updateLabyrinthPick(id, gameState.lobbyKey);
      sessionStorage.setItem("selectedLabyrinth", JSON.stringify(id));
    }

    function selectRole(name: string) {
      sessionStorage.setItem("chosenRole", JSON.stringify(name));
      updateRole(name, gameState.lobbyKey, loginState.username);
    }

    // open dialog before unload
    onbeforeunload = () => {
      if (
        lobbyState.users.some((user) => user.username === loginState.username)
      ) {
        exitLobby(lobbyKey.value, loginState.username);
      }
      return "Leaving Lobby";
    };
    // exit lobby on unload
    onunload = () => {
      if (
        lobbyState.users.some((user) => user.username === loginState.username)
      ) {
        exitLobby(lobbyKey.value, loginState.username);
      }
    };

    // exit lobby if any other page than game is opened
    onBeforeRouteLeave((to) => {
      const nextKey = to.params.key as string;
      if (
        nextKey != gameState.lobbyKey &&
        lobbyState.users.some((user) => user.username === loginState.username)
      ) {
        exitLobby(lobbyKey.value, loginState.username);
      }
    });

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
        if (lobbyState.users.length == 0) {
          router.push("/find");
        }
      } else {
        sessionStorage.setItem("lobbyKey", gameState.lobbyKey);
      }
      updateLabyrinths();
      updateUsers(gameState.lobbyKey);
      getRoles(gameState.lobbyKey).then((data) => (allRoles.value = data));
      getRoleOptions(gameState.lobbyKey);
    });

    return {
      selectedRole,
      readyCheck,
      selectLabyrinth,
      exitLobby,
      selectRole,
      allRoles,
      openRoles,
      users,
      lobbyKey,
      labyrinthOptions,
      selectedLabyrinth,
      loginState,
      isReady,
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
