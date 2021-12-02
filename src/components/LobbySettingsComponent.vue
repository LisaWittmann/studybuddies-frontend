<template>
    <h1>Lobby Einstellungen</h1>
    <section class="section">
        <p>Labyrinth hochladen</p>
        <input type="file" ref="data" id="file-input" @change="dataUpload" /><br />
        <p>Labyrinth auswählen</p>
        <DropdownMenu />
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
  },
});
</script>