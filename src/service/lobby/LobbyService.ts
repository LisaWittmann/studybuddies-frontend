import { reactive, readonly, computed } from "vue";

import { useAppService } from "@/service/AppService";
import { useGameStore } from "@/service/game/GameStore";

import { EventMessage, Operation } from "@/service/game/EventMessage";
import { User } from "@/service/login/User";
import { Role } from "@/service/game/Player";

import router from "@/router";

const { startLoading, globalState } = useAppService();
const {
  gameState,
  setLobbyKey,
  updateGameData,
  setPlayerData,
  updatePlayerData,
  setStarted,
} = useGameStore();

const lobbyKey = computed(() => gameState.lobbyKey);
const loggedInUser = computed(() => globalState.username);

const labyrinthAPI = "/api/labyrinth";
const lobbyAPI = "/api/lobby";

const lobbyState = reactive({
  users: new Array<User>(),
  selectedRole: "",
  openRoles: new Array<string>(),
  selectedLabyrinthName: "",
  labyrinthOptions: new Array<string>(),
  errormessage: "",
});

function resetLobbyState() {
  lobbyState.users = new Array<User>();
  lobbyState.selectedRole = "";
  lobbyState.openRoles = new Array<string>();
  lobbyState.selectedLabyrinthName = "";
  lobbyState.labyrinthOptions = new Array<string>();
  lobbyState.errormessage = "";
  setLobbyKey("");
}

/**
 * post selected json file to api to read in labyrinth model
 * @param fileList: list of selected labyrinth for upload
 * @returns promise with array of response messages for upload
 */
async function uploadJsonFiles(fileList: FileList) {
  const responseList = new Array<string>();
  if (fileList) {
    for (const file of fileList) {
      const data = new FormData();
      data.append("labFile", file);
      await fetch(`${labyrinthAPI}/read`, {
        method: "POST",
        body: data,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.text();
        })
        .then((jsonData) => {
          responseList.push("Upload von " + jsonData + " war erfolgreich");
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
 * Request to Backend to get a JSON represented Labyrinth by given name and
 * download it to Client's local storage as JSON-File.
 */
async function download(labyrinthName: string) {
  fetch(`${labyrinthAPI}/export?labyrinthName=${labyrinthName}`, {
    method: "GET",
    headers: {
      "Content-Type": "text/plain",
    },
  })
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = labyrinthName + ".json";
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
}

/**
 * send request to get all labyrinths in database that can be selected for game
 * sets the labyrinthOptions in the lobbyState with all labyrinth ids if request was successful
 * @throws error if request was not successful
 */
async function updateLabyrinths() {
  fetch(`${labyrinthAPI}/names`)
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then((response) => {
      lobbyState.labyrinthOptions = response;
    });
}

/**
 * send request to join lobby with given lobby key
 * redirects to lobby settings view of lobby if joining was successful
 * @param lobbyKey: identifying key of lobby that should be joined
 */
async function joinLobby(lobbyKey: string) {
  return fetch(`${lobbyAPI}/join/${lobbyKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "html/text;charset=utf-8",
    },
    body: loggedInUser.value,
  }).then((response) => {
    if (!response.ok) {
      if (response.status == 409) throw new Error("Diese Lobby ist voll.");
      else throw new Error("Diese Lobby konnte nicht gefunden werden.");
    }
    const key = lobbyKey.toUpperCase();
    setLobbyKey(key);
    router.push("/lobby/" + key);
  });
}

/**
 * send request to create new lobby and joins creating user automatically
 * redirects to lobby settings view of created lobby
 */
async function createLobby() {
  fetch(`${lobbyAPI}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "html/text;charset=utf-8",
    },
    body: loggedInUser.value,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((jsonData) => {
      setLobbyKey(jsonData.key);
      router.push("/lobby/" + jsonData.key);
    })
    .catch((error) => console.error(error));
}

/**
 * send request to remove user with given username from lobby
 * redirects back to find lobby view if request was successful
 */
async function exitLobby() {
  if (
    !lobbyState.users.some((user) => user.username === loggedInUser.value) ||
    !lobbyKey.value ||
    !loggedInUser.value
  ) {
    return;
  }
  return fetch(`${lobbyAPI}/leave/${lobbyKey.value}`, {
    method: "POST",
    headers: {
      "Content-Type": "html/text;charset=utf-8",
    },
    body: loggedInUser.value,
  })
    .then((response) => {
      if (response.ok) {
        router.push("/find");
        resetLobbyState();
      } else throw new Error(response.statusText);
    })
    .catch((error) => console.error(error));
}

/**
 * send request to pick an available role
 * @param role: the role which was picked from the user
 */
async function updateRole(role: string) {
  console.log(loggedInUser.value);
  const eventMessage = new EventMessage(
    Operation[Operation.ROLE_PICK],
    lobbyKey.value,
    loggedInUser.value,
    role
  );
  return fetch(`${lobbyAPI}/select-role`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventMessage),
  }).then((response) => {
    if (!response.ok) {
      if (response.status == 409)
        throw new Error("Diese Rolle ist bereits vergeben.");
      else throw new Error("Die Rolle konnte nicht gefunden werden.");
    }
    lobbyState.selectedRole = role;
  });
}

/**
 * send request to get every role that can be picked, without the roles that picked already
 */
async function getRoleOptions() {
  return fetch(`${lobbyAPI}/selectable-roles/${lobbyKey.value}`, {
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
 * send request to get all current users by username in lobby
 * @param lobbyKey: identifying key for lobby in which users should be requested
 * @returns promise of type void
 * @throws error if request was not successful
 */
async function updateUsers() {
  return fetch(`${lobbyAPI}/users/${lobbyKey.value}`, {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then((jsonData) => {
      const tempUsers = lobbyState.users;
      lobbyState.users = [];

      jsonData.forEach((username: string) => {
        const foundUser: User | undefined = tempUsers.find(
          (user) => user.username === username
        );

        if (foundUser) {
          lobbyState.users.push(foundUser);
        } else {
          lobbyState.users.push(new User(username));
        }
      });
    });
}

/**
 * get readyStates of all users in lobby
 * @returns promise of type void
 */
async function updateReadyStates() {
  if (lobbyState.users.length > 1) {
    return fetch(`${lobbyAPI}/users/ready/${lobbyKey.value}`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then((jsonData) => {
        lobbyState.users
          .filter((user) =>
            jsonData.some((username: string) => username == user.username)
          )
          .map((user) => user.setReady(true));
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

/**
 * get selected roles of all user in lobby and set gameStates playerdata
 * @returns promise of type void
 */
async function updateSelectedRoles() {
  return fetch(`${lobbyAPI}/users/roles/${lobbyKey.value}`)
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then((jsonData) => {
      for (const username in jsonData) {
        const role = (<any>Role)[jsonData[username]];
        setPlayerData(username, role);
      }
    })
    .catch((error) => console.error(error));
}

/**
 * send the selected Labyrinth to the BE
 * @returns promise containing evenMessage with selectedLabyrinth
 */
async function updateLabyrinthPick(labyrinthName: string) {
  const eventMessage = new EventMessage(
    Operation[Operation.LABYRINTH_PICK],
    lobbyKey.value,
    loggedInUser.value,
    labyrinthName
  );
  fetch(`${lobbyAPI}/labyrinth-pick`, {
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
 * @param blueprintLabName name of the new selected Labyrinth
 */
function setLabyrinthSelection(blueprintLabName: string) {
  lobbyState.selectedLabyrinthName = blueprintLabName;
}

/**
 * gets the selected Labyrinth from the Backend
 * and updates the local labyrinth selection in the lobbyState
 */
function getLabyrinthSelection() {
  fetch(`${lobbyAPI}/selectedLabyrinth/${lobbyKey.value}`)
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.text();
    })
    .then((jsonData) => {
      lobbyState.selectedLabyrinthName = jsonData
    })
    .catch((error) => console.error(error));
}

/**
 * sends a List of two Arguments to the BE, so there can be checked, whether every Player is ready or not
 * (and reacts to a wrong respond after receiving it)
 * @param username name of the user in the backend, which shall be taken out of the lobby
 * @param labName name of the blueprint labyrinth, used for the Game Progression
 */
function readyCheck() {
  if (!lobbyState.selectedLabyrinthName || !lobbyState.selectedRole) return;

  fetch(`${lobbyAPI}/ready/${lobbyKey.value}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loggedInUser.value),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error during ready check: " + response.statusText);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

/**
 * Finds the right user in the users list via the username param and sets the given ReadyState in it.
 * @param username The username (from the BE) of the user which pressed the "Ready" Button
 * @param readyState The state to determine whether the given user is ready or not
 */
function setUserReadyState(username: string, readyState: boolean) {
  lobbyState.users
    .find((user) => user.username == username)
    ?.setReady(readyState);
}

/**
 * Finds the right user in the users list via the username param and sets the given ReadyState in it.
 * @param username The username (from the BE) of the user which pressed the "Ready" Button
 * @param finished The state to determine whether the given user is ready or not
 */
function setUserFinishState(username: string, finished: boolean) {
  lobbyState.users
    .find((user) => user.username == username)
    ?.setFinished(finished);
}

/**
 * Initial game setup when all users are ready:
 * 1. Gathering the labyrinth information from the BE
 * 2. Updating the Users one last time, so they can get transferred to the gameState properly
 * 3. Setting up new Players on the basis of the users in the users list
 * 4. Overwriting the page history by replacing the url to the game view
 * @throws error with statusText
 */
async function setupGame() {
  startLoading();
  await updateUsers();
  await updateSelectedRoles();
  await updateGameData();

  lobbyState.users.forEach((user, index) => {
    const startTile = gameState.labyrinth.playerStartTileKeys[index];
    updatePlayerData(user.username, startTile);
  });

  router.push(`/game/${gameState.lobbyKey}`);
  setStarted(true);
}

export function useLobbyService() {
  return {
    updateRole,
    resetLobbyState,
    getRoleOptions,
    joinLobby,
    createLobby,
    exitLobby,
    uploadJsonFiles,
    updateUsers,
    updateLabyrinths,
    updateReadyStates,
    setLabyrinthSelection,
    getLabyrinthSelection,
    updateLabyrinthPick,
    readyCheck,
    setupGame,
    setUserReadyState,
    setUserFinishState,
    download,
    lobbyState: readonly(lobbyState),
  };
}
