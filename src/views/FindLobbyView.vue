<template>
    <h1>Platzhalter Logo</h1>
    <form class="login__form">
        <ul>
            <li>Spiel finden <input type="text"> <button type="submit">OK</button></li>
            <li>Spiel erstellen <button @click="createGame">Spiel erstellen</button></li>
        </ul>
        
    </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { User } from "@/service/User";
import router from "@/router";

export default defineComponent({
    name: "FindLobby",
    setup() {
        const user = new User();

        fetch("/api/lobby/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          }
        //   body: JSON.stringify(user),
        })
          .then((response) => {
            if (response.ok) router.push("/");
            // else hasErrors.value = true;
          })
          .catch((err) => console.log(err));
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