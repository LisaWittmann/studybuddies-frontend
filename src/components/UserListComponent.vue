<template>
  <div class="column-wrapper">
    <div class="user-list-labels">
      <div class="user-list-labels__item">Spielername</div>
      <div class="user-list-labels__item">Status</div>
    </div>
    <ul class="user-list">
      <li class="user-list__item" v-for="(user, index) of users" :key="index">
        <span>{{ user.username }}</span>
        <span
          class="fa fa-circle"
          :class="{
            'ready-indicator': user.isReady,
            'ready-indicator--inactive': !user.isReady,
          }"
        ></span>
      </li>
    </ul>
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
  width: $pref-width;
  max-width: $width-l;

  &__item {
    width: 100%;
    padding-top: $spacing-s;
    padding-bottom: $spacing-s;
    @include flex-center(space-between);
    @include border-bottom();

    &:first-of-type {
      border-top: 1px solid $color-grey;
    }
  }
}

.user-list-labels {
  @include flex-center(space-between);
  width: $pref-width;
  max-width: $width-l;

  &__item {
    font-size: $text-m;
  }
}

.ready-indicator {
  color: $color-light-green;

  &--inactive {
    color: rgb(216, 216, 216);
  }
}
</style>
