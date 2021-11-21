<template>
  <div class="login">
    <div class="login__content">
      <div class="login__content-header">
        <h1>Willkommen</h1>
        <h2>Bitte gib deinen Benutzernamen und dein Passwort ein</h2>
      </div>
      <div class="login__form-wrapper">
        <form v-if="login" class="login__form" action="/login" method="post">
          <input
            type="username"
            placeholder="Benutzername"
            v-model="username"
          />
          <input type="password" placeholder="Passwort" v-model="password" />
          <button type="submit">Anmelden</button>
          <p>
            Noch kein Benutzerkonto?
            <a @click="switchToRegister">Jetzt registrieren</a>
          </p>
        </form>

        <form v-else class="login__form" action="/register" method="post">
          <input
            type="username"
            placeholder="Benutzername"
            v-model="username"
          />
          <input type="password" placeholder="Passwort" v-model="password" />
          <input
            type="password"
            placeholder="Passwort"
            v-model="passwordRepeat"
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

export default defineComponent({
  name: "Login",
  setup() {
    // handles login/register state
    const login = ref(true);

    function switchToRegister() {
      login.value = false;
    }

    function switchToLogin() {
      login.value = true;
    }

    return {
      login,
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
    }

    a {
      text-decoration: underline;

      &:hover {
        color: $color-nearly-white;
      }
    }
  }
}
</style>
