<template>
  <router-view v-slot="{ Component }">
    <transition>
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useLoginStore } from "@/service/login/LoginStore";
export default defineComponent({
  setup() {
    const { loginState, fetchSessionStorage } = useLoginStore();
    fetchSessionStorage();
    console.log(loginState);
  },
});
</script>
