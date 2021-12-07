<template>
  <div class="user-list__wrapper">
    <div class="user-list">
      <div
        class="user-list__item"
        v-for="(username, index) of users"
        :key="index"
      >
        <span>{{ username }}</span>
        <span class="status">connected</span>
      </div>
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

<style lang="scss" scoped>
.user-list {
  width: 80%;
  max-width: 500px;

  &__wrapper {
    width: 100%;
    @include flex-center();
  }

  &__item {
    width: 100%;
    padding: 10px;
    @include flex-center();
    justify-content: space-between;
    border-bottom: 1px solid $color-grey;

    &:first-of-type {
      border-top: 1px solid $color-grey;
    }
  }
}
</style>
