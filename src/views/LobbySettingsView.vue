<template>
  <div class="container">
    <h1>Lobby {{ lobbyKey }}</h1>
    <section>
      <UserListComponent :users="users" />
    </section>
    <section>
      <h2>Rolle auswählen:</h2>      
        <div class="roles">
          <span v-if="userPickedHacker" key="hacker">Hacker</span>
          <span v-else-if="userPickedDesigner" key="designer">Designer</span>
        </div>
      <RadioButtonGroup :options="decisions" v-model="selected"/>
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
import RadioButtonGroup from "@/components/RadioButtonGroup.vue";

export default defineComponent({
  name: "LobbySettingsView",
  components: { UserListComponent, DropdownComponent, RadioButtonGroup },
  setup() {
    //Radiobutton data
    const decisions = ref(["hacker", "designer"]);
    let selected = ref("");
    const userPickedHacker = computed(()=> {
      return selected.value === "Hacker";
    });
    const userPickedDesigner = computed(() => {
      return selected.value === "Designer";
    });

    const { loginState } = useLoginStore();
    const { updateUsers, updateLabyrinths, readyCheck, exitLobby } =
      useLobbyService();
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
    });

    const lobbyKey = computed(() => gameState.lobbyKey);

    return {
      readyCheck,
      selectLabyrinth,
      exitLobby,
      decisions,
      userPickedHacker,
      userPickedDesigner,
      selected,
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
