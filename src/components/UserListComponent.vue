<template>
  <div class="user-list">
    <div
      class="user-list__item"
      v-for="(username, index) of users"
      :key="index"
    >
      {{ username }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "UserListComponent",
  props: {
    users: {
      type: [],
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped></style>
