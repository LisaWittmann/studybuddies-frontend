<template>
    <input type="file" ref="data" id="file-input" @change="dataUpload"/><br />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import {useUploadService} from "@/service/UploadService";

export default defineComponent({
  name: "lobby",
  setup() {

    const {uploadFiles} = useUploadService();
    const data = ref({} as HTMLInputElement);

    async function dataUpload() {
      if (data.value.files != null) {
        await uploadFiles(data.value.files);
      }
    }

    return {
      data,
      dataUpload
    };
  },
});
</script>
