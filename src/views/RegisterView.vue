<template>
  <div class="flex-container">
    <section>
      <h1>Registrieren</h1>
      <form @submit.prevent="registerUser" class="column-wrapper">
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
        <button class="button--filled button--medium" type="submit">
          Registrieren
        </button>
        <p>
          Du bist bereits registriert?
          <router-link to="/">Jetzt anmelden</router-link>
        </p>
        <span>
          Lade jetzt dein eigenes Labyrinth hoch:<br />
          <router-link to="/upload">Labyrinth hochladen</router-link>
        </span>
        <span class="error">{{ errorMessage }}</span>
      </form>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useLoginStore } from "@/service/login/LoginStore";
import { User } from "@/service/login/User";

export default defineComponent({
  name: "RegisterView",
  setup() {
    const { register, loginState } = useLoginStore();
    const user = new User(loginState.username);
    const errorMessage = ref("");

    function registerUser() {
      register(user).catch((error) => (errorMessage.value = error.message));
    }

    return {
      user,
      registerUser,
      errorMessage,
    };
  },
});
</script>

<style lang="scss" scoped>
h1 {
  margin-bottom: 0;
}
</style>
