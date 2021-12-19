<template>
  <label :for="option">
    <input
      type="radio"
      :value="option"
      :id="option"
      @change="$parent.$emit('input', $event.target.value)"
      name="radio-input"
    />
    <img :src="getImgUrl(option)" :alt="option" width="100" />   
    {{ option }} 
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        option: {type: String, required: true}
    },
    setup() {
      /**
       * creates image url
       */
      function getImgUrl(imgName : string){
        return require('../assets/img/roles/'+imgName+'-role.svg'); 
      }

      return {
        getImgUrl,
      };            
    }
});
</script>


<style scoped>

input[type="radio"] {
    position: absolute;
    opacity: 0;
}

input + img {
    cursor: pointer;
}

input:checked + img {
    opacity: 0.5;
}
</style>
