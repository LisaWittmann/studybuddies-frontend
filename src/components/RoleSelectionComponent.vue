<template>
  <label :for="option">
    <input
      type="radio"
      :value="option"
      :id="option"
      :disabled="disabled"
      @change="onClick(option)"
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
        option: {type: String, required: true},
        disabled: { type: Boolean, default: false }
    },
    setup(_, {emit}) {
      /**
       * creates image url
       */
      function getImgUrl(imgName : string){
        return require('../assets/img/roles/'+imgName.toLowerCase()+'-role.svg'); 
      }
      function onClick(option : string) {
        emit("clicked", option);
      }

      return {
        getImgUrl,
        onClick
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

input:disabled + img {
    opacity: 0.5;
}

input:checked + img {
    opacity: 1;
    border: solid salmon;
}

</style>
