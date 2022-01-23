<template>
  <div class="flex-container">
    <transition name="slow-fade" appear>
      <section>
        <h1>Anmelden</h1>
        <form @submit.prevent="loginUser" class="column-wrapper">
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
            <router-link to="/upload-labyrinth"
              >Labyrinth hochladen</router-link
            >
          </span>
          <span class="error">{{ errorMessage }}</span>
        </form>
      </section>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useLoginService } from "@/service/login/LoginService";
import { User } from "@/service/login/User";

export default defineComponent({
  name: "LoginView",
  setup() {
    const { login } = useLoginService();

    const user = ref({} as User);
    const errorMessage = ref("");

    function loginUser() {
      login(user.value).catch((error) => (errorMessage.value = error.message));
    }

    return {
      user,
      loginUser,
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
