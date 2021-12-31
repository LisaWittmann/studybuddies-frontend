import router from "@/router";
import { useLoginStore } from "@/service/login/LoginStore";
import { useGameStore } from "@/service/game/GameStore";
import { EventMessage } from "@/service/game/EventMessage";
import { reactive, readonly } from "vue";
import { PickOperation } from "./game/EventMessage";
import { Role } from "./game/Player";

const lobbyState = reactive({
  users: new Array<string>(),
  selectedRole: "",
  openRoles: new Array<string>(),
  selectedLabyrinth: 0,
  labyrinthOptions: new Array<number>(),
  errormessage: "",
});

function setLobbyState(
  users: string | null,
  selectedLabyrinth: string | null,
  labyrinthOptions: string | null,
  errormessage: string | null,
  selectedRole: string | null
) {
  if (users) lobbyState.users = JSON.parse(users);
  if (selectedLabyrinth)
    lobbyState.selectedLabyrinth = JSON.parse(selectedLabyrinth) as number;
  if (labyrinthOptions)
    lobbyState.labyrinthOptions = JSON.parse(labyrinthOptions);
  if (errormessage) lobbyState.errormessage = JSON.parse(errormessage);
  if (selectedRole) lobbyState.selectedRole = JSON.parse(selectedRole);
}

/**
 * send request to pick an available role
 * @param role: the role which was picked from the user
 * @param lobbyKey: identifying key of lobby that should be joined
 * @param username: identifying name of user that should join lobby
 */
async function updateRole(role: string, lobbyKey: string, username: string) {
  lobbyState.selectedRole = role;
  const eventMessage: EventMessage = {
    operation: "ROLE_PICK",
    lobbyKey: lobbyKey,
    username: username,
    data: role,
  };
  return fetch("/api/lobby/select-role", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventMessage),
  }).then((response) => {
    if (!response.ok) {
      if (response.status == 409)
        throw new Error("Diese Rolle ist bereits vergeben.");
      else throw new Error("Die Rolle konnte nicht gefunden werden.");
    }
  });
}

/**
 * send request to get every role which exists
 * @param lobbyKey: identifying key of lobby that should be joined
 */
async function getRoles(lobbyKey: string) {
  return fetch("/api/lobby/roles/" + lobbyKey, {
    method: "GET",
  }).then((response) => {
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  });
}

/**
 * send request to get every role that can be picked, without the roles that picked already
 * @param lobbyKey: identifying key of lobby that should be joined
 */
async function getRoleOptions(lobbyKey: string) {
  return fetch("/api/lobby/selectable-roles/" + lobbyKey, {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then((data) => {
      lobbyState.openRoles = data;
    });
}

/**
 * send request to join lobby with given lobby key
 * redirects to lobby settings view of lobby if joining was successful
 * @param lobbyKey: identifying key of lobby that should be joined
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
 * send request to create new lobby and joins creating user automatically
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
 * redirects back to find lobby view if request was successful
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
      else throw new Error(response.statusText);
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
    responseList.push("Kein File zum Laden gefunden");
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
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then((response) => {
      lobbyState.users = response;
      sessionStorage.setItem("users", JSON.stringify(lobbyState.users));
    });
}

/**
 * send request to get all labyrinths in database that can be selected for game
 * sets the labyrinthOptions in the lobbyState with all labyrinth ids if request was successful
 * @throws error if request was not successful
 */
async function updateLabyrinths() {
  fetch("/api/labyrinth/ids")
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then((response) => {
      console.log(response);
      lobbyState.labyrinthOptions = response;
      sessionStorage.setItem(
        "labyrinthOptions",
        JSON.stringify(lobbyState.labyrinthOptions)
      );
    });
}

/**
 * send the selected Labyrinth to the BE
 * @returns promise containing evenMessage with selectedLabyrinth
 * @throws error if request was not successful
 */
async function updateLabyrinthPick(labId: number, lobbyKey: string) {
  const { loginState } = useLoginStore();
  const eventMessage = new PickOperation(
    lobbyKey,
    loginState.username,
    labId.toString()
  );
  fetch("/api/lobby/labyrinth-pick", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventMessage),
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
    })
    .catch((error) => console.error(error));
}

/**
 * sets the new Labyrinth in the DropdownMenuComponent
 * @param selectedLabyrinth : id of the new selected Labyrinth
 */
function setLabyrinthSelection(selectedLabyrinth: number) {
  lobbyState.selectedLabyrinth = selectedLabyrinth;
}

/**
 * sends a List of two Arguments to the BE, so there can be checked, whether every Player is ready or not
 * (and reacts to a wrong respond after receiving it)
 * @param username: name of the user in the backend, which shall be taken out of the lobby
 * @param labId : id of the blueprint labyrinth, used for the Game Progression
 */
function readyCheck(username: string, labId: number) {
  const { gameState } = useGameStore();
  const args: string[] = [];
  args.push(username);
  args.push(String(labId));
  console.log("gameState vor ready finish");
  console.log(gameState);

  fetch(`/api/lobby/ready/${gameState.lobbyKey}`, {
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

function setupGame() {
  const { updateGameData, gameState, setPlayerData } = useGameStore();
  updateUsers(gameState.lobbyKey)
    .then(() => {
      lobbyState.users.forEach((user, index) => {
        // for testing roles
        fetch(`/api/lobby/role/${gameState.lobbyKey}/${user}`)
          .then((response) => response.json())
          .then((jsonData) => {
            const role = (<any>Role)[jsonData];
            const startTile = gameState.labyrinth.playerStartTileIds[index];
            setPlayerData(user, role, startTile);
          });
      });
    })
    .then(() =>
      updateGameData().then(() => router.push(`/game/${gameState.lobbyKey}`))
    );
}

export function useLobbyService() {
  return {
    updateRole,
    getRoles,
    getRoleOptions,
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
