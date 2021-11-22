<template>
  <div class="login">
    <div class="login__content">
      <div class="login__content-header">
        <h1>Willkommen</h1>
        <h2>Bitte gib deinen Benutzernamen und dein Passwort ein</h2>
      </div>
      <div class="login__form-wrapper">
        <form
          v-if="inLoginState"
          @submit.prevent="login(user)"
          class="login__form"
        >
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
            <a @click="switchToRegister">Jetzt registrieren</a>
          </p>
        </form>

        <form v-else @submit.prevent="register(user)" class="login__form">
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
            <a @click="switchToLogin">Jetzt anmelden</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { User } from "@/service/User";
import { useLoginService } from "@/service/LoginService";

export default defineComponent({
  name: "Login",
  setup() {
    // handles login/register state
    const inLoginState = ref(true);
    const { login, register } = useLoginService();
    const user = new User();

    function switchToRegister() {
      inLoginState.value = false;
    }

    function switchToLogin() {
      inLoginState.value = true;
    }

    return {
      user,
      login,
      register,
      inLoginState,
      switchToRegister,
      switchToLogin,
    };
  },
});
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  background-color: $color-grey;
  @include flex-center();

  &__content {
    max-width: 50%;
    margin: auto;

    &-header {
      margin-bottom: $spacing-m;

      h1 {
        line-height: 100%;
      }

      h2 {
        font-style: normal;
        font-size: $headline-s;
      }
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;

    input,
    button {
      font-size: $text-s;
      border-radius: 15px;
      padding: 5px 10px;
    }

    input {
      background: transparent;
      color: $color-dark-grey;
      border: 2px solid $color-dark-grey;
      min-height: 25px;
      margin-bottom: $spacing-xs;

      &::placeholder,
      &::-moz-placeholder {
        opacity: 1;
      }
    }

    input:focus {
      &::placeholder,
      &::-moz-placeholder {
        opacity: 0;
      }
    }

    button {
      min-height: 40px;
      color: $color-nearly-white;
      background: $color-dark-grey;
      margin-top: $spacing-s;
      border: 2px solid $color-dark-grey;
      cursor: pointer;
    }

    a {
      text-decoration: underline;
      cursor: pointer;

      &:hover {
        color: $color-nearly-white;
      }
    }
  }
}
</style>
