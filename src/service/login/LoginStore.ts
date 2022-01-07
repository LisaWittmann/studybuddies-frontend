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
  sessionStorage.removeItem("username");
}

/**
 * send request to log in user with given username and password
 * updates loginState with user data if request was successful
 * and redirects to LobbyView
 * sets errorMessage of loginState if request was not successful
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
    .then((jsonData) => {
      loginState.username = jsonData.username;
      loginState.errormessage = "";
      loginState.isLoggedIn = true;
      sessionStorage.setItem("username", loginState.username);
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
 * redirects to LoginView if request was successful
 * @param user: user object with username and password
 * @throws error with error message
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

/**
 * get username from sessionStorage
 * so user won't get logged out on browser refresh
 */
function getLoginSessionStorage() {
  const loginSession = sessionStorage.getItem("username");
  if (loginSession) {
    loginState.isLoggedIn = true;
    loginState.username = loginSession;
  }
}

export function useLoginStore() {
  return {
    loginState: readonly(loginState),
    register,
    login,
    logout,
    getLoginSessionStorage,
  };
}
