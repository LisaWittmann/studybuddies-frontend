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
              @click="readyCheck()"
            >
              Bereit
            </button>
          </transition>
          <transition name="delay-fade">
            <button
              class="button button--small button__exit"
              @click="exitLobby()"
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

import { useAppService } from "@/service/AppService";
import { useLobbyService } from "@/service/lobby/LobbyService";
import { useGameStore } from "@/service/game/GameStore";
import { Role } from "@/service/game/Player";
import { User } from "@/service/login/User";

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
    const { globalState } = useAppService();
    const {
      updateUsers,
      readyCheck,
      exitLobby,
      setLabyrinthSelection,
      updateLabyrinthPick,
      updateLabyrinths,
      lobbyState,
      updateRole,
      getRoleOptions,
      updateReadyStates,
      getLabyrinthSelection,
    } = useLobbyService();
    const { gameState } = useGameStore();

    const lobbyKey = computed(() => gameState.lobbyKey);

    const users = computed(() => lobbyState.users);

    const labyrinthOptions = computed(() => lobbyState.labyrinthOptions);
    const selectedLabyrinth = computed(() => lobbyState.selectedLabyrinthName);

    const allRoles = ref(
      Object.values(Role).filter((role) => typeof role === "string")
    );
    const openRoles = computed(() => lobbyState.openRoles);
    const selectedRole = computed(() => lobbyState.selectedRole);

    const isReady = computed(
      () =>
        lobbyState.users.find(
          (user: User) => user.username === globalState.username
        )?.isReady
    );
    const loading = computed(() => globalState.loading);

    function copy(text: string) {
      navigator.clipboard.writeText(text);
    }

    function selectLabyrinth(labyrinthName: string) {
      setLabyrinthSelection(labyrinthName);
      updateLabyrinthPick(labyrinthName);
    }

    function selectRole(name: string) {
      updateRole(name);
    }

    onbeforeunload = () => {
      exitLobby();
      return "leaving lobby";
    };

    // exit lobby if any other page than game is opened
    onBeforeRouteLeave((to) => {
      const nextKey = to.params.key as string;
      if (nextKey != lobbyKey.value) {
        exitLobby();
      }
    });

    onMounted(() => {
      const route = router.currentRoute.value;
      if (lobbyKey.value != (route.params.key as string)) router.push("/find");
      updateUsers()
        .then(() => updateReadyStates())
        .catch(() => router.push("/find"));
      updateLabyrinths();
      getRoleOptions();
      updateReadyStates();
      getLabyrinthSelection();
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
