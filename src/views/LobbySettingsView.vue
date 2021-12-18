<template>
  <div class="container">
    <h1>Lobby {{ lobbyKey }}</h1>
    <section>
      <UserListComponent :users="users" />
    </section>
    <section>
      <h2>Labyrinth hochladen:</h2>
      <label class="button button--small button--upload">
        <input
          type="file"
          ref="upload"
          accept=".json"
          @change="uploadLabyrinth"
        />
        Hochladen
      </label>
    </section>
    <section>
      <h2>Labyrinth auswählen:</h2>
      <DropdownComponent :items="labyrinthOptions" @select="selectLabyrinth" />
    </section>
    <section>
      <div class="column-wrapper">
        <button class="button--small button--filled" @click="readyCheck">
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
import { defineComponent, ref } from "vue";
import { useLobbyService } from "@/service/LobbyService";
import { useLoginStore } from "@/service/login/LoginStore";
import DropdownComponent from "@/components/DropdownComponent.vue";
import UserListComponent from "@/components/UserListComponent.vue";
import router from "@/router";

export default defineComponent({
  name: "LobbySettingsView",
  components: { UserListComponent, DropdownComponent },
  setup() {
    const { loginState } = useLoginStore();
    const {
      uploadJsonFiles,
      updateUsers,
      updateLabyrinths,
      readyCheck,
      exitLobby,
      setupGame,
    } = useLobbyService();
    const upload = ref({} as HTMLInputElement);

    const route = router.currentRoute.value;
    const lobbyKey = route.params.key as string;

    const users = ref(new Array<string>());
    const labyrinthOptions = ref(new Array<number>());
    const selectedLabyrinth = ref();

    updateUsers(lobbyKey).then((data) => (users.value = data));
    updateLabyrinths().then((data) => (labyrinthOptions.value = data));

    function selectLabyrinth(id: number) {
      selectedLabyrinth.value = id;
    }

    async function uploadLabyrinth() {
      if (upload.value.files != null) {
        await uploadJsonFiles(upload.value.files);
      }
      updateLabyrinths().then((data) => (labyrinthOptions.value = data));
    }

    return {
      readyCheck,
      uploadLabyrinth,
      selectLabyrinth,
      exitLobby,
      setupGame,
      users,
      upload,
      lobbyKey,
      labyrinthOptions,
      selectedLabyrinth,
      username: loginState.username,
    };
  },
});
</script>

<style lang="scss" scoped>
h1 {
  margin: $spacing-l 0;
}

input[type="file"] {
  display: none;
}
</style>
