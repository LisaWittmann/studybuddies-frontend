<template>
  <h1>Lobby Einstellungen</h1>
  <br /><br /><br /><br />
  <section class="section">
    <h2>Labyrinth hochladen:</h2>
    <input
      type="file"
      ref="data"
      id="file-input"
      @change="dataUpload"
    /><br /><br /><br /><br />
    <h2>Labyrinth auswählen:</h2>
    <DropdownMenu /><br /><br /><br /><br />
    <button class="button" v-on:click="readyClicked">Bereit</button>
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

    return {
      data,
      dataUpload,
    };

    function readyClicked() {
      //functionality if both players clicked on ready button
      alert("Clicked!");
    }
  },
});
</script>
