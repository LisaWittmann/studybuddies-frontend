<template>
  <LobbyComponent />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LobbyComponent from "@/components/LobbyComponent.vue";

export default defineComponent({
  name: "Lobby",
  components: { LobbyComponent },
});
</script>
