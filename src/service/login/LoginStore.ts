import { reactive, readonly } from "vue";
import { User } from "@/service/login/User";
import router from "@/router";

const loginState = reactive({
  username: "",
  errormessage: "",
  isLoggedIn: false,
});

function logout() {
  loginState.username = "";
  loginState.errormessage = "";
  loginState.isLoggedIn = false;
  localStorage.removeItem("username");
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
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then((jsondata) => {
      loginState.username = jsondata.username;
      loginState.errormessage = "";
      loginState.isLoggedIn = true;
      localStorage.setItem("username", loginState.username);
      router.push("/find");
      console.log(loginState);
    })
    .catch(() => {
      loginState.username = "";
      loginState.isLoggedIn = false;
      loginState.errormessage =
        "Dein Passwort war nicht korrekt. Bitte versuche es noch einmal.";
    });
}

function fetchLocalStorage() {
  const lastSession = localStorage.getItem("username");
  if (lastSession) {
    loginState.isLoggedIn = true;
    loginState.username = lastSession;
  }
}

export function useLoginStore() {
  return {
    loginState: readonly(loginState),
    login,
    logout,
    fetchLocalStorage,
  };
}
