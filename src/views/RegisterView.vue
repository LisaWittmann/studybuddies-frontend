<template>
  <div class="flex-container">
    <transition name="slow-fade" appear>
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
            <router-link to="/login">Jetzt anmelden</router-link>
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
  name: "RegisterView",
  setup() {
    const { register } = useLoginService();

    const user = ref({} as User);
    const errorMessage = ref("");

    function registerUser() {
      register(user.value).catch(
        (error) => (errorMessage.value = error.message)
      );
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
