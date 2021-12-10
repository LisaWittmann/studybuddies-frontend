import { reactive, readonly } from "vue";
import { User } from "@/service/login/User";
import router from "@/router";

const loginState = reactive({
  username: "",
  errormessage: "",
  isLoggedIn: false,
});

/**
 * log out current user by setting loginState
 * to default values
 */
function logout() {
  loginState.username = "";
  loginState.errormessage = "";
  loginState.isLoggedIn = false;
  localStorage.removeItem("username");
}

/**
 * send request to login user with given username and password
 * updates loginState with user data if request was successfull
 * ans redirects to lobbyview
 * sets errorMessage of loginState if request was not successfull
 * @param user: user object containing username and password
 */
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
      localStorage.setItem("username", loginState.username);
      router.push("/find");
      console.log(loginState);
    })
    .catch((error) => {
      loginState.username = "";
      loginState.isLoggedIn = false;
      loginState.errormessage = error.message;
    });
}

/**
 * send request to register user with given username and password
 * redirects to login view if request was successfull
 * @param user: user object with username and password
 * @throws error with error essage
 */
async function register(user: User) {
  return fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(user),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(
        "Deine Registrierung ist fehlgeschlagen. Bitte versuche es noch einmal"
      );
    }
    router.push("/login");
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
    register,
    login,
    logout,
    fetchLocalStorage,
  };
}
