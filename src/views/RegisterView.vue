<template>
  <div class="register">
    <div class="register__content">
      <div class="register__content-header">
        <h1>Registrieren</h1>
      </div>
      <form @submit.prevent="registerUser" class="form">
        <input
          type="username"
          placeholder="Benutzername"
          v-model="user.username"
          required
        />
        <input
          type="password"
          placeholder="Passwort"
          v-model="user.password"
          required
        />
        <button type="submit">Registrieren</button>
        <p>
          Du bist bereits registriert?
          <router-link to="/login">Jetzt anmelden</router-link>
        </p>
        <span>
          Lade jetzt dein eigenes Labyrinth hoch:<br/>
          <router-link to="/upload">Labyrinth hochladen</router-link>
        </span>
        <span class="error">{{ errorMessage }}</span>
      </form>
    </div>
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

<style lang="scss" scoped>
.register {
  width: 100%;
  height: 100%;
  @include flex-center();

  &__content {
    max-width: 400px;
    width: 70%;
    margin: auto;

    &-header {
      margin-bottom: $spacing-m;
    }
  }
}
</style>
