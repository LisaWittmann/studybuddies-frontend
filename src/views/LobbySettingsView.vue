<template>
  <LobbySettingsComponent />
  <div v-for="(username, i) of users" :key="i">
    {{ username }}
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import router from "@/router";
import LobbySettingsComponent from "@/components/LobbySettingsComponent.vue";

export default defineComponent({
  name: "LobbySettingsView",
  components: { LobbySettingsComponent },
  setup() {
    const route = router.currentRoute.value;
    const lobbyKey = route.params.key;
    const users = ref(new Array<string>());

    fetch("/api/lobby/users/" + lobbyKey, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then((jsonData) => {
        users.value = jsonData;
        console.log(users);
      })
      .catch((error) => {
        console.error(error);
      });

    return { users };
  },
});
</script>
