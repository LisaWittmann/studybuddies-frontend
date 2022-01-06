<template>
  <section>
    <h1>Labyrinth hochladen:</h1>
    <label class="file-upload">
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
    <p>
      <router-link to="/register">Jetzt registrieren</router-link> /
      <router-link to="/login">Jetzt anmelden</router-link>
    </p>
  </section>
  <section>
    <div v-if="uploadResponse.length > 0" class="response-wrapper">
      <p
        class="response response--text"
        v-for="(item, index) of uploadResponse"
        :key="index"
      >
        {{ item }}
      </p>
    </div>
  </section>
</template>

<script lang="ts">
import { useLobbyService } from "@/service/LobbyService";
import { useLoginStore } from "@/service/login/LoginStore";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "LabyrinthUploadView",
  components: {},
  setup() {
    const { loginState } = useLoginStore();
    const { uploadJsonFiles } = useLobbyService();
    const upload = ref({} as HTMLInputElement);

    const uploadResponse = ref(new Array<string>());

    async function uploadLabyrinth() {
      if (upload.value.files != null) {
        await uploadJsonFiles(upload.value.files).then((response) => {
          uploadResponse.value = response;
        });
      }
    }

    return {
      uploadLabyrinth,
      upload,
      username: loginState.username,
      uploadResponse,
    };
  },
});
</script>

<style lang="scss" scoped>
input[type="file"] {
  display: none;
}

.file-upload,
.response-wrapper {
  border: 1px solid $color-grey;
  border-radius: 8px;
  font-weight: 300;
  display: inline-block;
  padding: 10px 12px;
  width: 80%;
  max-width: 200px;
}

.file-upload {
  cursor: pointer;
}

.file-upload:hover {
  color: $color-beige;
  font-weight: 400;
}

.response-wrapper {
  color: $color-beige;
}
</style>
