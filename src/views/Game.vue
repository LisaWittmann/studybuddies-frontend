<template>
  <Scene />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Scene from "@/components/Scene.vue";

export default defineComponent({
  name: "Game",
  components: { Scene },
});
</script>
