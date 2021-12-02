<template>
    <div class="relative">
        <a @click="toggleVisibility" href="#">
            <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24"
            height="24"><path class="heroicon-ui" d="M15.3 9.3a1 1 0 0 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1
            1.4-1.4l3.3 3.29 3.3-3.3z"></path></svg>
        </a>
        <ul v-if="isVisible" class = "absolute normal-case font-normal right-0 bg-white shadow overflow-hidden rounded w-48 border mt-2 py-1 z-20">
            <li>
                <a href="#" >
                    <svg fill="currentColor" class="text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path class="heroicon-ui"></path></svg>
                    <span class="ml-2">Labyrinth 1</span>
                </a>
            </li>
            <li>
                <a href="#" class="flex items-center px-3 py-3 hover:bg-gray-200"> 
                    <svg fill="currentColor" class="text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path class="heroicon-ui"></path></svg>
                    <span class="ml-2">Labyrinth 2</span>
                </a>
            </li>
            <li>  
                <a href="#" class="flex items-center px-3 py-3 hover:bg-gray-200"> 
                    <svg fill="currentColor" class="text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path class="heroicon-ui"></path></svg>
                    <span class="ml-2">Labyrinth 3</span>
                </a>
            </li>
            <li>
                <a href="#" class="flex items-center px-3 py-3 hover:bg-gray-200">
                    <svg fill="currentColor" class="text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path class="heroicon-ui"></path></svg>
                    <span class="ml-2">Labyrinth 4</span> 
                </a>
            </li>
            <li>  
                <a href="#" class="flex items-center px-3 py-3 hover:bg-gray-200">
                    <svg fill="currentColor" class="text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path class="heroicon-ui"></path></svg>
                    <span class="ml-2">Labyrinth 5</span>              
                </a>
            </li>
            <li>
                <a href="#" class="flex items-center px-3 py-3 hover:bg-gray-200"> 
                    <svg fill="currentColor" class="text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path class="heroicon-ui"></path></svg>
                    <span class="ml-2">Labyrinth 6</span>
                </a>
            </li>
            <li> 
                <a href="#" class="flex items-center px-3 py-3 hover:bg-gray-200">
                    <svg fill="currentColor" class="text-gray-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"></path><path></path></svg>
                    <span class="ml-2">Labyrinth 7</span>
                </a>
            </li>
        </ul>                                   
    </div>               
</template>

<script lang="ts">
export default {
  data() {
    return {
      isVisible: false,
      focusedIndex: 0,
    }
  },
  methods: {
    toggleVisibility() {
      this.isVisible = !this.isVisible
    },
    hideDropdown() {
      this.isVisible = false
      this.focusedIndex = 0
    },
}
}
</script>

<style scoped>
</style>