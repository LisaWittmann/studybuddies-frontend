<template>
  <h1>Lobby {{ lobbyKey }}</h1>
  <section>
    <UserListComponent :users="users" />
  </section>
  <section>
    <h2>Labyrinth hochladen:</h2>
    <label class="file-upload">
      <input type="file" ref="upload" accept=".json" @change="dataUpload" />
      Hochladen
    </label>
  </section>
  <section>
    <h2>Labyrinth auswählen:</h2>
    <DropdownComponent />
  </section>
  <section>
    <div class="button-wrapper">
      <button class="button button--confirm" @click="confirmSettings">Bereit</button>
      <button class="button button--exit" @click="exitLobby(lobbyKey)">Verlassen</button>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useLobbyService } from "@/service/LobbyService";
import DropdownComponent from "@/components/DropdownComponent.vue";
import UserListComponent from "@/components/UserListComponent.vue";
import router from "@/router";

export default defineComponent({
  name: "LobbySettingsView",
  components: { UserListComponent, DropdownComponent },
  setup() {
    const { uploadJsonFiles, selectLabyrinth, confirmSettings, exitLobby } =
      useLobbyService();

    const upload = ref({} as HTMLInputElement);

    async function dataUpload() {
      if (upload.value.files != null) {
        await uploadJsonFiles(upload.value.files);
      }
    }

    const route = router.currentRoute.value;
    const lobbyKey = route.params.key;
    const users = ref(new Array<string>());

    fetch("/api/lobby/users/" + lobbyKey, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then((jsonData) => {
        users.value = jsonData;
        console.log(users);
      })
      .catch((error) => {
        console.error(error);
      });

    return { dataUpload, confirmSettings, exitLobby, upload, lobbyKey, users };
  },
});
</script>

<style lang="scss" scoped>
h1 {
  margin: $spacing-l 0;
}

.button-wrapper {
  @include flex-center();
  flex-direction: column;
}

.button {
  margin: 10px;
  min-height: 35px;
  background: transparent;
  font-size: 16px;

  &--exit {
    &:hover,
    &:active {
      background: darkred;
    }
  }

  &--confirm {
    &:hover,
    &:active {
      background: $color-green;
    }
  }
}

input[type="file"] {
  display: none;
}

.file-upload,
button {
  border: 1px solid $color-grey;
  border-radius: 8px;
  font-weight: 300;
  display: inline-block;
  padding: 10px 12px;
  width: 80%;
  max-width: 200px;
  cursor: pointer;
}
</style>
