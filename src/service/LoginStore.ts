import { reactive, readonly } from "vue";
import { User } from "@/service/User";

const loginState = reactive({
  username: "",
  errormessage: "",
  isLoggedIn: false,
});

function logout() {
  loginState.username = "";
  loginState.errormessage = "";
  loginState.isLoggedIn = false;
}

async function login(user: User) {
  fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Dein Passwort war nicht korrekt. Bitte versuche es noch einmal."
        );
      }
      return response.json();
    })
    .then((jsondata) => {
      loginState.username = jsondata.username;
      loginState.errormessage = "";
      loginState.isLoggedIn = true;
    })
    .catch((error) => {
      loginState.username = "";
      loginState.isLoggedIn = false;
      loginState.errormessage = error.message;
    });
}

export function useLoginStore() {
  return {
    loginState: readonly(loginState),
    login,
    logout,
  };
}
