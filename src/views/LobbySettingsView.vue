<template>
  <transition name="fade" appear>
    <div class="container" :class="{ 'container--fixed': loading }">
      <h1>
        Lobby
        <span class="uppercase" @click="copy(lobbyKey)"> {{ lobbyKey }}</span>
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
          <transition name="delay-fade">
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
import { onBeforeRouteLeave } from "vue-router";

import { useLobbyService } from "@/service/LobbyService";
import { useLoginStore } from "@/service/login/LoginStore";
import { useGameStore } from "@/service/game/GameStore";

import DropdownComponent from "@/components/DropdownComponent.vue";
import UserListComponent from "@/components/UserListComponent.vue";
import RadioButtonGroupComponent from "@/components/RadioButtonGroupComponent.vue";
import router from "@/router";

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

    const allRoles = ref([]);
    const openRoles = computed(() => lobbyState.openRoles);
    const selectedRole = computed(() => lobbyState.selectedRole);

    const isReady = computed(
      () =>
        lobbyState.users.find((user) => user.username === loginState.username)
          ?.isReady
    );
    const loading = computed(() => gameState.loading);

    const copy = (text: string) => navigator.clipboard.writeText(text);
 
    function selectLabyrinth(id: number) {
      setLabyrinthSelection(id);
      updateLabyrinthPick(id, gameState.lobbyKey);
    }

    function selectRole(name: string) {
      updateRole(name, gameState.lobbyKey, loginState.username);
    }

    onbeforeunload = () => {
      return "Leaving Lobby";
    };

    onunload = () => {
      if (
        lobbyState.users.some((user) => user.username === loginState.username)
      ) {
        exitLobby(gameState.lobbyKey, loginState.username);
      }
    };

    // exit lobby if any other page than game is opened
    onBeforeRouteLeave((to) => {
      const nextKey = to.params.key as string;
      if (
        nextKey != gameState.lobbyKey &&
        lobbyState.users.some((user) => user.username === loginState.username)
      ) {
        exitLobby(gameState.lobbyKey, loginState.username);
      }
    });

    onMounted(() => {
      const route = router.currentRoute.value;
      setLobbyKey(route.params.key as string);
      updateUsers(gameState.lobbyKey).catch(() => router.push("/find"));
      updateLabyrinths();
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
      loading,
      copy,
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
    cursor: copy;

    &:hover {
      color: $color-light-green;
    }
  }
}
</style>
