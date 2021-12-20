import router from "@/router";
import { useGameStore } from "@/service/game/GameStore";
import { MainPlayer, PartnerPlayer, Player } from "./game/Player";
import { useLoginStore } from "@/service/login/LoginStore";
import { reactive, readonly } from "vue";
import { PickOperation } from "./game/EventMessage";


const lobbyState = reactive({
  users: new Array<string>(),
  selectedLabyrinth: 0,
  labyrinthOptions: new Array<number>(),
  errormessage: "",
});

function setLobbyState(users: string | null, selectedLabyrinth: string | null, labyrinthOptions: string | null, errormessage: string | null) {
  if(users) lobbyState.users = JSON.parse(users);
  console.log(selectedLabyrinth);
  if(selectedLabyrinth) lobbyState.selectedLabyrinth = JSON.parse(selectedLabyrinth) as number;
  console.log(lobbyState.selectedLabyrinth);
  if(labyrinthOptions) lobbyState.labyrinthOptions = JSON.parse(labyrinthOptions);
  if(errormessage) lobbyState.errormessage = JSON.parse(errormessage);
}

/**
 * send request to join lobby with given lobby key
 * redirects to lobby settings view of lobby if joining was sucessfull
 * @param lobbyKey: identifying key of lobby that sould be joined
 * @param username: identifying name of user that should join lobby
 */
async function joinLobby(lobbyKey: string, username: string) {
  return fetch("/api/lobby/join/" + lobbyKey, {
    method: "POST",
    headers: {
      "Content-Type": "html/text;charset=utf-8",
    },
    body: username,
  }).then((response) => {
    if (!response.ok) {
      if (response.status == 409) throw new Error("Diese Lobby ist voll.");
      else throw new Error("Diese Lobby konnte nicht gefunden werden.");
    }
    router.push("/lobby/" + lobbyKey);
  });
}

/**
 * send request to create new lobby and joins creating user automaticly
 * redirects to lobby settings view of created lobby
 * @param username: identifying name of user that creates new lobby
 */
async function createLobby(username: string) {
  fetch("/api/lobby/create", {
    method: "POST",
    headers: {
      "Content-Type": "html/text;charset=utf-8",
    },
    body: username,
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then((jsonData) => {
      router.push("/lobby/" + jsonData.key);
    })
    .catch((error) => console.error(error));
}

/**
 * send request to remove user with given username from lobby
 * redirects back to find lobby view if request was successfull
 * @param lobbyKey: identifying key of lobby from which user should be removed
 * @param username: identifying name of user that should be removed
 */
async function exitLobby(lobbyKey: string, username: string) {
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
 * post selected json file to api to read in labyrinth model
 * @param fileList : list of selected labyrinth for upload
 */
async function uploadJsonFiles(fileList: FileList): Promise<string[]> {
  const responseList = new Array<string>();
  if (fileList) {
    for (const file of fileList) {
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
 * send request to get all current users by username in lobby
 * @param lobbyKey: identifying key for lobby in which users should be requested
 * @returns promise containing the list of users if request was successful
 * @throws error if request was not successful
 */
async function updateUsers(lobbyKey: string) {
  fetch("/api/lobby/users/" + lobbyKey, {
    method: "GET",
  }).then((response) => {
    if (!response.ok) throw new Error(response.statusText);
    return response.json()
  }).then((response) => {

    lobbyState.users = response;
    console.log(lobbyState.users);
    console.log(response);
  });
}


/**
 * send request to get all labyrinths in database that can be selected for game
 * sets the labyrinthOtions in the lobbyState with all labyrinth ids if request was successful
 * @throws error if request was not successful
 */
async function updateLabyrinths() {
  fetch("/api/labyrinth/ids").then((response) => {
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  }).then((response) =>{
    console.log(response);
    lobbyState.labyrinthOptions = response;
  })
}

/**
 * send the selected Labyrinth to the BE
 * @returns promise containing evenMessage with selectedLabyrinth
 * @throws error if request was not successful
 */
async function updateLabyrinthPick(labId: number, lobbykey: string) {
  const { loginState } = useLoginStore();
  const eventMessage = new PickOperation(lobbykey, loginState.username, labId.toString());
  fetch("/api/lobby/labyrinthpick/" + lobbykey, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventMessage),
  }).then((response) => {
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  })
  .catch((error) => console.error(error));
}

/**
 * sets the new Labyrinth in the Dropdownmenu
 * @param selectedLabyrinth : the id of the new selected Labyrinth
 */
function setLabyrinthSelection(selectedLabyrinth: number) {
  lobbyState.selectedLabyrinth = selectedLabyrinth;
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

  fetch(`/api/lobby/ready/` + gameState.lobbyKey, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error during ready check: " + response.statusText);
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
function setupGame() {
  const { updateGameData, gameState, setPlayerData } = useGameStore();
  updateGameData().then(() => {

    updateUsers(gameState.lobbyKey);
    lobbyState.users.forEach((user,index) => {
      setPlayerData(user, gameState.labyrinth.playerStartTileIds[index]);
    });

    router.replace(`/game/${gameState.lobbyKey}`);
  });
}

export function useLobbyService() {
  return {
    setLobbyState,
    joinLobby,
    createLobby,
    exitLobby,
    uploadJsonFiles,
    updateUsers,
    updateLabyrinths,
    setLabyrinthSelection,
    updateLabyrinthPick,
    readyCheck,
    setupGame,
    lobbyState: readonly(lobbyState),
  };
}
