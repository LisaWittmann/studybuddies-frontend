<template>
  <div class="login">
    <div class="login__content">
      <div class="login__content-header">
        <h1>Willkommen</h1>
        <h2>Bitte gib deinen Benutzernamen und dein Passwort ein</h2>
      </div>
      <div class="login__form-wrapper">
        <input type="text" name="username" v-model="username" />
        <input type="password" name="password" v-model="password" />
        <button @click="handleLogin(username, password)">Login</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useLoginStore } from "@/service/LoginStore";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Login",
  setup() {
    const router = useRouter();
    const username = "";
    const password = "";

    const { loginstate, doLogin, doLogout } = useLoginStore();

    onMounted(async () => {
      await doLogout();
    });

    async function handleLogin(username: string, password: string) {
      console.log(`Username: ${username}\nPass: ${password}`);
      const loggedIn = await doLogin(username, password);
      if (loggedIn) {
        router.push("/lobby");
      }
    }

    return {
      username,
      password,
      handleLogin,
      loginstate,
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

    .error {
      color: red;
    }
  }
}
</style>
