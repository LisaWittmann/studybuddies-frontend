<template>
  <LobbySettingsComponent />
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import LobbySettingsComponent from "@/components/LobbySettingsComponent.vue";

export default defineComponent({
  name: "LobbySettingsView",
  components: { LobbySettingsComponent },
  props: {
    key: { type: String, required: true },
  },
  setup(props) {

    console.log(props.key);
    const lobbyKey = ref(props.key);
    async function getUsersAndContext() {
      fetch("/api/lobby/users/" + lobbyKey.value, {
        method: "GET"
      })
          .then((response) => {
            if (!response.ok) throw new Error(response.statusText);
            return response.json();
          })
          .then((jsonData) => {
            console.log(jsonData);
          })
          .catch(() => {
            console.log("error ;)");
          });
    }
    return {
      getUsersAndContext
    };
  },
});
</script>
