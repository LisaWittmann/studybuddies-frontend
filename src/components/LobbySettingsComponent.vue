<template>
  <h1 class="view-headline">Lobby Einstellungen</h1>
  <section class="section">
    <ul class="labyrinth-context">
      <li class="headline-elements">
        <h2>Labyrinth hochladen:</h2>
      </li>
      <li class="upload-labyrinth">
        <input type="file" ref="data" id="file-input" @change="dataUpload" />
      </li>
      <li class="headline-elements">
        <h2>Labyrinth auswählen:</h2>
      </li>
      <li class="select-labyrinth">
        <DropdownMenu />
        <button
          class="confirm-labyrinth-button"
          v-on:click="confirmSelectedLabyrinth"
        >
          Bestätigen
        </button>
      </li>
    </ul>
    <button class="ready-button" @click="readyClicked">Bereit</button>

    <h2>Zurück zur Lobbyfindung:</h2>
    <button type="button" @click="exitLobby">verlassen</button>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useLabyrinthService } from "@/service/labyrinth/LabyrinthService";
import DropdownMenu from "@/components/DropdownMenu.vue";
import router from "@/router";
import { useLoginStore } from "@/service/login/LoginStore";

export default defineComponent({
  name: "LobbySettingsComponent",
  components: { DropdownMenu },
  setup() {
    const { uploadJsonFiles } = useLabyrinthService();
    const data = ref({} as HTMLInputElement);

    async function dataUpload() {
      if (data.value.files != null) {
        await uploadJsonFiles(data.value.files);
      }
    }

    function readyClicked() {
      //TODO: functionality if both players clicked on ready button
      alert("Game should start now!");
    }

    function confirmSelectedLabyrinth() {
      //TODO: functionality to confirm selected Labyrinth in dropdown menu
      // button shown and hidden depending on clicked item in dropdown
      alert("Confirm button clicked!");
    }

    const loginState = useLoginStore();

    function exitLobby() {
      const route = router.currentRoute.value;
      const lobbyKey = route.params.key;
      fetch("/api/lobby/leave/" + lobbyKey, {
        method: "POST",
        headers: {
          "Content-Type": "html/text;charset=utf-8",
        },
        body: loginState.loginState.username,
      }).then((response) => {
        if (response.ok) {
          router.push("/find");
        } else {
          console.log(response.statusText);
        }
      });
    }

    return {
      data,
      dataUpload,
      readyClicked,
      confirmSelectedLabyrinth,
      exitLobby,
    };
  },
});
</script>
<style lang="scss" scoped>
.labyrinth-context {
  list-style: none;
}

.headline-elements {
  margin-top: 10%;
}

.ready-button {
  margin-top: 10%;
  width: 10em;
  height: 3em;
}
</style>
