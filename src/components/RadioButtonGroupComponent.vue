<template>
  <div class="input-group">
    <RoleSelectionComponent
      v-for="option in options"
      :option="option"
      :key="option"
      @clicked="onClick"
      :disabled="!selectable.includes(option)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import RoleSelectionComponent from "./RoleSelectionComponent.vue";

export default defineComponent({
  name: "RadioButtonGroupComponent",
  components: { RoleSelectionComponent },
  props: {
    options: {
      type: Array,
      required: true,
    },
    selectable: {
      type: Array,
      required: true,
    },
  },
  setup(_, { emit }) {
    function onClick(option: string) {
      emit("clicked", option);
    }

    return {
      onClick,
    };
  },
});
</script>

<style lang="scss" scoped>
.input-group {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 80%;
  max-width: 350px;
  margin: 20px auto;
  padding: 15px 20px;
}
</style>
