<template>
  <LobbySettingsComponent/>
  <div v-for="(username, i) of users" v-bind:key="i">
    {{ username }}
  </div>
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
    const users: Array<string> = new Array<string>();

    fetch("/api/lobby/users/" + lobbyKey, {
      method: "GET"
    })
        .then((response) => {
          if (!response.ok) throw new Error(response.statusText);
          return response.json();
        })
        .then((jsonData) => {
          users.values = jsonData;
          console.log(users);
        })
        .catch(() => {
          console.log("error ;)");
        });

    return {users};
  },
});
</script>
