<template>
  <LobbySettingsComponent/>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import router from "@/router";
import LobbySettingsComponent from "@/components/LobbySettingsComponent.vue";

export default defineComponent({
  name: "LobbySettingsView",
  components: {LobbySettingsComponent},
  setup() {
    const route = router.currentRoute.value;
    const lobbyKey = route.params.key;
    const users: Map<string, boolean> = new Map<string, boolean>([]);

    fetch("/api/lobby/users/" + lobbyKey, {
      method: "GET"
    })
        .then((response) => {
          if (!response.ok) throw new Error(response.statusText);
          return response.json();
        })
        .then((jsonData) => {
          console.log(jsonData);
          users.values = jsonData;
          console.log(users);
        })
        .catch(() => {
          console.log("error ;)");
        });

    return {};
  },
});
</script>
