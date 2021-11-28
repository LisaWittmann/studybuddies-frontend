<template>
  <input type="file" ref="data" id="file-input" @change="dataUpload" />
  <Instructions v-if="showInstructions" :instructions="instructions" />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useLabyrinthService } from "@/service/LabyrinthService";
import Instructions from "@/components/Instructions.vue";

export default defineComponent({
  name: "Lobby",
  components: { Instructions },
  setup() {
    // activate to test instructions
    const { uploadJsonFiles } = useLabyrinthService();
    const data = ref({} as HTMLInputElement);
    const showInstructions = ref(false);

    // test data
    const instructions = [
      "Willkommen unter den Eichen",
      "Deine erste Aufgabe erwartet dich",
      "Finde zur Semester Einführungsveranstaltung",
    ];

    async function dataUpload() {
      if (data.value.files != null) {
        await uploadJsonFiles(data.value.files);
      }
    }

    return {
      data,
      dataUpload,
      instructions,
      showInstructions,
    };
  },
});
</script>
