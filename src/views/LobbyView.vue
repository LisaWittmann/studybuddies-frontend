<template>
  <input type="file" ref="data" id="file-input" @change="dataUpload" />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useLobbyService } from "@/service/LobbyService";

export default defineComponent({
  name: "LobbyView",
  setup() {
    const { uploadJsonFiles } = useLobbyService();
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