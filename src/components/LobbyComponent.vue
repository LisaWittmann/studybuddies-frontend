<template>
  <input type="file" ref="data" id="file-input" @change="dataUpload" /><br />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useLabyrinthService } from "@/service/LabyrinthService";

export default defineComponent({
  name: "lobby",
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
