import { useAppService } from "@/service/AppService";
import { User } from "@/service/login/User";
import router from "@/router";

const { globalState, setUsername } = useAppService();

const loginAPI = "/api/login";
const registerAPI = "/api/register";

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
 * updates globalState with user data if request was successful
 * and redirects to LobbyView
 * @param user: user object containing username and password
 * @throws error with error message
 */
async function login(user: User) {
  return fetch(loginAPI, {
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
  return fetch(registerAPI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(user),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(
        "Deine Registrierung ist fehlgeschlagen. Bitte beachte, dass der Name nur aus Wortcharaktern bestehen darf."
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
