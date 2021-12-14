import router from "@/router";
import { useGameStore } from "@/service/game/GameStore";
import { MainPlayer, PartnerPlayer } from "./game/Player";
import { useLoginStore } from "@/service/login/LoginStore";

/**
 * post selected json file to api to read in labyrinth model
 * @param filelist : list of selected labyrinth for upload
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

/**
 * gets the list of the users in the lobby
 * @param lobbyKey : used to identify the lobby in the backend
 * @returns 
 */
async function updateUsers(lobbyKey: string) {
  return fetch("/api/lobby/users/" + lobbyKey, {
    method: "GET",
  }).then((response) => {
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  });
}

/**
 * gets a List of all avaliable Labyrinths by their ids
 * @returns 
 */
async function updateLabyrinths() {
  return fetch("/api/labyrinth/ids").then((response) => {
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  });
}

/**
 * Sends a post Request to the BE so the user can leave the Lobby
 * @param lobbyKey : used to identify the lobby in the backend
 * @param username : used to identify the user in the backend, which shall be taken out of the lobby
 */
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

/**
 * sends a List of two Arguments to the BE, so there can be checked, wheather every Player is ready or not
 * (and reacts to a wrong respond after recieving it) 
 * @param username : used to identify the user in the backend, which shall be taken out of the lobby
 * @param labId : used to identify in the BE which Labyrinth is to be used for the Game Progression
 */
function readyCheck(username: string, labId: number) {
  const { gameState } = useGameStore();
  const args: string[] = [];
  args.push(username);
  args.push(String(labId));
  console.log("gameState vor ready finish");
  console.log(gameState);

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

/**
 * @todo: Im Messagebrokertask nutzen
 * @param users : list with usernames in the lobby
 */
function setupGame(users: string[]) {
  const { gameState, setPlayer } = useGameStore();
  //setPlayer(username, gameState.labyrinth.playerStartTileIds[0]);

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
