<template>
    <h1>Platzhalter Logo</h1>
    <form class="login__form">
        <ul>
            <li>Spiel finden <input type="text"> <button type="submit">OK</button></li>
            <li>Spiel erstellen <input type="text" placeholder="FJIE4D (<-- Beispiel-Code)"></li>
        </ul>
        
    </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import router from "@/router";

export default defineComponent({
    name: "FindLobby",
    setup() {
        // Logic here
    },
})
</script>

<style lang="scss" scoped>
    h1 {
        border: 1px solid black;
        padding: 1em;
    }

    ul {
        list-style-type: none;
    }
    
    li {
        margin: 1em;
    }
</style>