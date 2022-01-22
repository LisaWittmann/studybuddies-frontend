import { useAppService } from "@/service/AppService";
import { User } from "@/service/login/User";
import router from "@/router";

const { globalState, setUsername } = useAppService();

/**
 * log out current user by setting loginState
 * to default values
 */
function logout() {
  setUsername("");
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
  return fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      if (!response.ok) {
        console.log(response);
        throw new Error(
          "Deine Eingabedaten waren nicht korrekt. Bitte versuche es noch einmal."
        );
      }
      return response.json();
    })
    .then((jsonData) => {
      setUsername(jsonData.username);
      sessionStorage.setItem("username", globalState.username);
      router.push("/find");
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
function getSession() {
  const loginSession = sessionStorage.getItem("username");
  if (loginSession) {
    setUsername(loginSession);
  }
}

export function useLoginService() {
  return {
    register,
    login,
    logout,
    getSession,
  };
}
