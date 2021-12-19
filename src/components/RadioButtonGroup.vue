<template>
  <div class="input-group">
    <RoleSelectionComponent v-for="option in options" :option="option" :key="option" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RoleSelectionComponent from "./RoleSelectionComponent.vue";

export default defineComponent({
    name: "RadioButtonGroup",
    components: { RoleSelectionComponent },
    props: { 
        options: {
            type: Array, 
            required: true}
     }
});
</script>

<style scoped>
.input-group {
  width: 20%;
  margin: 20px auto;
  padding: 15px 20px;
  border: none;
  
  display: flex;
  justify-content: space-between;
}

label {
  cursor: pointer;
}
</style>