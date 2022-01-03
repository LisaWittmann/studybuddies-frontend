<template>
  <div class="column-wrapper">
    <div class="user-list-labels">
      <div class="user-list-labels__item">Spielername</div>
      <div class="user-list-labels__item">Status</div>
    </div>

    <div class="user-list">
      <div class="user-list__item" v-for="(user, index) of users" :key="index">
        <span>{{ user.username }}</span>
        <span
          class="fa fa-circle"
          :class="{
            'ready-indicator': user.isReady,
            'ready-indicator-inactive': !user.isReady,
          }"
        ></span>
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
      type: Array,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.user-list {
  width: 80%;
  max-width: 500px;

  &__item {
    width: 100%;
    padding: 10px 0 10px 0;
    @include flex-center();
    justify-content: space-between;
    border-bottom: 1px solid $color-grey;

    &:first-of-type {
      border-top: 1px solid $color-grey;
    }
  }
}

.user-list-labels {
  display: flex;
  width: 80%;
  max-width: 500px;
  justify-content: space-between;

  &__item {
    font-size: $text-m;
  }
}

.ready-indicator {
  color: $color-light-green;
}

.ready-indicator-inactive {
  color: rgb(216, 216, 216);
}
</style>
