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
          <span class="error">{{ errorMessage }}</span>
        </form>
      </section>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useLoginStore } from "@/service/login/LoginStore";
import { User } from "@/service/login/User";

export default defineComponent({
  name: "RegisterView",
  setup() {
    const user = new User();
    const errorMessage = ref("");

    const { register } = useLoginStore();

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
