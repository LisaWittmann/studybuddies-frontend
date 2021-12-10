<template>
  <section>
    <h2>Labyrinth hochladen:</h2>
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
      <a href="/register">Jetzt registrieren</a> / 
      <a href="/login">Jetzt anmelden</a>
    </p>
  </section>
  <section>
    <div class="response-wrapper"
      v-bind:style="{ 'visibility: hidden;': uploadResponse.length <= 0 }">
      <p class="response response--text"
        v-for="(item, index) of uploadResponse"
        :key="index">
        {{ item }}
      </p>
    </div>
  </section>
</template>

<script lang="ts">
import router from "@/router";
import { useLobbyService } from "@/service/LobbyService";
import { useLoginStore } from "@/service/login/LoginStore";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "LobbySettingsView",
  components: {},
  setup() {
    const { loginState } = useLoginStore();
    const { uploadJsonFiles } =
      useLobbyService();
    const upload = ref({} as HTMLInputElement);

    const uploadResponse = ref(new Array<string>());

    async function uploadLabyrinth() {
      if (upload.value.files != null) {
        await uploadJsonFiles(upload.value.files)
        .then((response) => {
          uploadResponse.value = response;
        });
      }
    }

    return {
      uploadLabyrinth,
      upload,
      username: loginState.username,
      uploadResponse
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