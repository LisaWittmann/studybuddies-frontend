<template>
  <label :for="option">
    <input
      type="radio"
      :value="option"
      :id="option"
      :class="option"
      @change="$parent.$emit('input', $event.target.value)"
      name="radio-input"
    />
    {{ option }}
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        option: {type: String, required: true}
    }
});
</script>


<style scoped>
.designer {
  background: url(../assets/img/roles/designer-role.svg) no-repeat;
}
</style>
