<template>
  <router-view />
</template>

<style>
#app {
  text-align: center;
  height: 100vh;
}
</style>
<script lang="ts">
import { defineComponent } from "vue";
import { useLoginStore } from "@/service/login/LoginStore";
export default defineComponent({
  setup() {
    const { loginState, fetchLocalStorage } = useLoginStore();
    fetchLocalStorage();
    console.log(loginState);
  },
});
</script>
