<template>
  <div class="login">
    <div class="login__content">
      <div class="login__content-header">
        <h1>Willkommen</h1>
        <h2>Bitte gib deinen Benutzernamen und dein Passwort ein</h2>
      </div>
      <div class="login__form-wrapper">
        <input type="text" name="username" v-model="username">
        <input type="password" name="password" v-model="password">
        <button @click="handleLogin(username, password)">Login</button>
        <!-- <form
          v-if="inLoginState"
          @submit.prevent="login(user)"
          class="login__form"
        >
          <span v-if="usernameEmpty" class="error">{{
            emptyUsernameMessage
          }}</span>
          <input
            type="username"
            placeholder="Benutzername"
            v-model="user.username"
          />

          <span v-if="passwordEmpty" class="error">{{
            emptyPasswordMessage
          }}</span>
          <input
            type="password"
            placeholder="Passwort"
            v-model="user.password"
          />

          <button type="submit">Anmelden</button>
          <p>
            Noch kein Benutzerkonto?
            <a @click="switchToRegister">Jetzt registrieren</a>
          </p>
        </form>
        <form v-else @submit.prevent="register(user)" class="login__form">
          <span v-if="usernameEmpty" class="error">{{
            emptyUsernameMessage
          }}</span>
          <input
            type="username"
            placeholder="Benutzername"
            v-model="user.username"
          />
          <span v-if="passwordEmpty" class="error">{{
            emptyPasswordMessage
          }}</span>
          <input
            type="password"
            placeholder="Passwort"
            v-model="user.password"
          />
          <button type="submit">Registrieren</button>
          <p>
            Du bist bereits registriert?
            <a @click="switchToLogin">Jetzt anmelden</a>
          </p>
        </form> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
// import { User } from "@/service/User";
import { useLoginStore } from "@/service/LoginStore";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Login",
  setup() {
    // handles login/register state
    // const inLoginState = ref(false);
    // const user = new User();
    const router = useRouter()
    const username = ''
    const password = ''

    const hasErrors = ref(false);
    // const errorMessage = ref("testing error message");
    const {
      loginstate,
      doLogin,
      doLogout
    } = useLoginStore()

    onMounted(async() => {
      await doLogout()
    })

    async function handleLogin(username: string, password: string) {
      console.log(`Username: ${username}\nPass: ${password}`)
      await doLogin(username, password)
      await router.push('/lobby')
    }

    // const usernameEmpty = ref(false);
    // const passwordEmpty = ref(false);

    // const emptyUsernameMessage = "Benutzername darf nicht leer sein";
    // const emptyPasswordMessage = "Passwort darf nicht leer sein";

    // function switchToRegister() {
    //   // loginstate.isLoggedIn.value = false;
    //   hasErrors.value = false;
    // }

    // function switchToLogin() {
    //   // inLoginState.value = true;
    //   hasErrors.value = false;
    // }

    // Refactor entire logic into computed
    // function validateProcess() {
    //   if (!loginstate.username) {
    //     usernameEmpty.value = true;
    //     hasErrors.value = true;
    //   } else {
    //     usernameEmpty.value = false;
    //   }

    //   if (!loginstate.) {
    //     passwordEmpty.value = true;
    //     hasErrors.value = true;
    //   } else {
    //     passwordEmpty.value = false;
    //   }

    //   if (user.username && user.password) {
    //     usernameEmpty.value = false;
    //     passwordEmpty.value = false;
    //     hasErrors.value = false;
    //     return true;
    //   }

    //   return false;
    // }

    // function login() {
    //     fetch("/api/login", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json;charset=utf-8",
    //       },
    //       body: JSON.stringify(loginstate.username),
    //     })
    //       .then((response) => {
    //         if (response.ok) router.push("/lobby");
    //         else hasErrors.value = true;
    //       })
    //       .catch((err) => console.log(err));
    //   }

    // function register() {
    //     fetch("/api/register", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json;charset=utf-8",
    //       },
    //       body: JSON.stringify(loginstate.username),
    //     })
    //       .then((response) => {
    //         if (response.ok) switchToLogin();
    //         else hasErrors.value = true;
    //       })
    //       .catch((err) => console.log(err));
    //   }



    return {
      // user,
      // login,
      // register,
      // // inLoginState,
      // switchToRegister,
      // switchToLogin,
      // hasErrors,
      // // errorMessage,
      // emptyUsernameMessage,
      // emptyPasswordMessage,
      // usernameEmpty,
      // passwordEmpty,
      username,
      password,
      handleLogin,
      loginstate
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
