import router from "@/router";
import { useGameStore } from "@/service/game/GameStore";
import { MainPlayer, PartnerPlayer } from "./game/Player";
import { useLoginStore } from "@/service/login/LoginStore";

/**
 * post selected json file to api to read in labyrinth model
 * @param filelist: list of selected labyrinth for upload
 */
async function uploadJsonFiles(filelist: FileList): Promise<string[]> {
  const responseList = new Array<string>();
  if (filelist) {
    for (const file of filelist) {
      const data = new FormData();
      data.append("labFile", file);
      await fetch("/api/labyrinth/read", {
        method: "POST",
        body: data,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          responseList.push("Upload von " + file.name + " war erfolgreich");
          return response.json();
        })
        .catch((error) => {
          responseList.push("Upload von " + file.name + " ist fehlgeschlagen");
          console.error(error);
        });
    }
    return responseList;
  } else {
    responseList.push("Keine File zum Laden gefunden");
    return responseList;
  }
}

async function updateUsers(lobbyKey: string) {
  return fetch("/api/lobby/users/" + lobbyKey, {
    method: "GET",
  }).then((response) => {
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  });
}

async function updateLabyrinths() {
  return fetch("/api/labyrinth/ids").then((response) => {
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  });
}

function exitLobby(lobbyKey: string, username: string) {
  fetch("/api/lobby/leave/" + lobbyKey, {
    method: "POST",
    headers: {
      "Content-Type": "html/text;charset=utf-8",
    },
    body: username,
  })
    .then((response) => {
      if (response.ok) router.push("/find");
      else new Error(response.statusText);
    })
    .catch((error) => console.error(error));
}

function readyCheck() {
  const { loginState } = useLoginStore();
  const { gameState } = useGameStore();
  const args: string[] = [];
  args.push(loginState.username);
  args.push(String(gameState.labyrinthId));

  fetch(`/api/lobby/${gameState.lobbyKey}/ready`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(args)
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error during ready check");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function setupGame(users: string[], labyrinthId: number, username: string) {
  const { updatePlayer, gameState } = useGameStore();
  for (const user of users) {
    if (user == username) {
      updatePlayer(new MainPlayer(username, true, 0));
    } else {
      updatePlayer(new PartnerPlayer(user, false, 1));
    }
  }

  router.replace(`/game/${gameState.lobbyKey}`);
}

export function useLobbyService() {
  return {
    uploadJsonFiles,
    updateUsers,
    updateLabyrinths,
    readyCheck,
    setupGame,
    exitLobby,
  };
}
