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
    <button class="ready-button" v-on:click="readyClicked">Bereit</button>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useLabyrinthService } from "@/service/LabyrinthService";
import DropdownMenu from "@/components/DropdownMenu.vue";

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

    return {
      data,
      dataUpload,
      readyClicked,
      confirmSelectedLabyrinth,
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
