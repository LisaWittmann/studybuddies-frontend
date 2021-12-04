<template>
  <div class="login">
    <div class="login__content">
      <div class="login__content-header">
        <h1>Anmelden</h1>
      </div>
      <form @submit.prevent="loginUser(user)" class="form">
        <input
          type="username"
          placeholder="Benutzername"
          v-model="user.username"
        />
        <input type="password" placeholder="Passwort" v-model="user.password" />
        <span v-if="hasErrors" class="error">{{ errorMessage }}</span>
        <button type="submit">Anmelden</button>
        <p>
          Noch kein Benutzerkonto?
          <a href="/register">Jetzt registrieren</a>
        </p>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useLoginStore } from "@/service/LoginStore";
import { User } from "@/service/User";
import router from "@/router";

export default defineComponent({
  name: "Login",
  setup() {
    const user = new User();
    const { loginState, login } = useLoginStore();
    const hasErrors = ref(false);

    function loginUser(user: User) {
      login(user).then(() => {
        console.log(loginState);
        hasErrors.value = loginState.isLoggedIn;
        if (loginState.isLoggedIn) router.push("/lobby");
      });
    }

    return {
      user,
      loginUser,
      hasErrors,
      errorMessage: loginState.errormessage,
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
    }
  }
}
</style>
