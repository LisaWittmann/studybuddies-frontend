<template>
  <div class="login">
    <div class="login__content">
      <div class="login__content-header">
        <h1>Anmelden</h1>
      </div>
      <form @submit.prevent="login(user)" class="form">
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
        <button type="submit">Anmelden</button>
        <p>
          Noch kein Benutzerkonto?
          <router-link to="/register">Jetzt registrieren</router-link>
        </p>
        <span>
          Lade jetzt dein eigenes Labyrinth hoch:<br/>
          <router-link to="/upload">Labyrinth hochladen</router-link>
        </span>
        <span class="error">{{ loginState.errormessage }}</span>
      </form>
    </div>
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
    const user = new User();

    return {
      user,
      login,
      loginState,
    };
  },
});
</script>

<style lang="scss" scoped>
.login {
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
