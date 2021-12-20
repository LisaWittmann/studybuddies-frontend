<template>
  <div class="flex-container">
    <section>
      <h1>Anmelden</h1>
      <form @submit.prevent="login(user)" class="column-wrapper">
        <input
          class="input--medium"
          type="username"
          placeholder="Benutzername"
          v-model="user.username"
          required
        />
        <input
          class="input--medium"
          type="password"
          placeholder="Passwort"
          v-model="user.password"
          required
        />
        <button class="button--medium button--filled" type="submit">
          Anmelden
        </button>
        <p>
          Noch kein Benutzerkonto?
          <router-link to="/register">Jetzt registrieren</router-link>
        </p>
        <span>
          Lade jetzt dein eigenes Labyrinth hoch:<br />
          <router-link to="/upload">Labyrinth hochladen</router-link>
        </span>
        <span class="error">{{ loginState.errormessage }}</span>
      </form>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useLoginStore } from "@/service/login/LoginStore";
import { User } from "@/service/login/User";

export default defineComponent({
  name: "LoginView",
  setup() {
    const { loginState, login } = useLoginStore();
    const user = new User(loginState.username);

    return {
      user,
      login,
      loginState,
    };
  },
});
</script>
