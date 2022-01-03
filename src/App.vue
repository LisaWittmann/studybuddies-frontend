<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useLoginStore } from "@/service/login/LoginStore";
export default defineComponent({
  setup() {
    const { fetchSessionStorage } = useLoginStore();
    fetchSessionStorage();
  },
});
</script>
