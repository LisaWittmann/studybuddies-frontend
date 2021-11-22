import { User } from "@/service/User";
import router from "@/router";

async function login(user: User) {
  await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      if (response.ok) router.push("/lobby");
    })
    .catch((err) => console.log(err));
}

async function register(user: User) {
  await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      if (response.ok) router.push("/lobby");
    })
    .catch((err) => console.log(err));
}

export function useLoginService() {
  return { login, register };
}
