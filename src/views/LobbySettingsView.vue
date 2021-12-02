<template>
  <LobbySettingsComponent />
  <Instructions v-if="showInstructions" :instructions="instructions" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LobbySettingsComponent from "@/components/LobbySettingsComponent.vue";

export default defineComponent({
  name: "LobbySettingsView",
  components: { LobbySettingsComponent },
  setup() {
    return {  };
  },
});
</script>
