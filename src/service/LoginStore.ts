import { reactive, readonly } from "vue";

const loginstate = reactive({
  username: "",
  errormessage: "",
  isLoggedIn: false,
});

export function doLogout() {
  loginstate.username = "";
  loginstate.errormessage = "";
  loginstate.isLoggedIn = false;
}

export async function doLogin(user: string, pass: string): Promise<boolean> {
  try {
    const userObj = {
      username: user,
      password: pass,
    };

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(userObj),
    });

    if (!response.ok) {
      console.error("ERROR");
      loginstate.errormessage = "Fehler beim einloggen!";
      return false;
    }

    const responseData = response.json();
    console.log(responseData);

    loginstate.username = user;
    loginstate.errormessage = "";
    loginstate.isLoggedIn = true;

    console.log(loginstate);

    return true;
  } catch (reason) {
    console.warn(`Catch activated`);
    loginstate.errormessage = String(reason);

    return false;
  }
}

export function useLoginStore() {
  return {
    loginstate: readonly(loginstate),
    doLogin,
    doLogout,
  };
}
