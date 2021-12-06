<template>
  <div class="register">
    <div class="register__content">
      <div class="register__content-header">
        <h1>Registrieren</h1>
      </div>
      <form @submit.prevent="register(user)" class="form">
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
          <a href="/login">Jetzt anmelden</a>
        </p>
        <span class="error">{{ errorMessage }}</span>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { User } from "@/service/login/User";
import router from "@/router";

export default defineComponent({
  name: "RegisterView",
  setup() {
    const user = new User();
    const errorMessage = ref("");

    function register() {
      fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(user),
      })
        .then((response) => {
          if (!response.ok) throw new Error(response.statusText);
        })
        .then(() => {
          errorMessage.value = "";
          router.push("/login");
        })
        .catch(() => {
          errorMessage.value =
            "Deine Registrierung ist fehlgeschlagen. Bitte versuche es noch einmal";
        });
    }

    return {
      user,
      register,
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
