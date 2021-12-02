<template>
  <LobbySettingsComponent />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LobbySettingsComponent from "@/components/LobbySettingsComponent.vue";

export default defineComponent({
  name: "LobbySettingsView",
  components: { LobbySettingsComponent },
  setup() {
    return {};
  },
});
</script>
