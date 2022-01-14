<template>
  <section>
    <h1>Labyrinth hochladen:</h1>
    <label class="button button--small button__upload">
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

.response-wrapper {
  @include border();
  border-radius: $border-radius-m;
  font-weight: $outfit-light;
  display: inline-block;
  padding: $spacing-xs;
  width: $pref-width;
  max-width: $width-s;
  color: $color-beige;
}
</style>
