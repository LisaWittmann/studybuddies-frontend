import router from "@/router";
import { useLoginStore } from "@/service/login/LoginStore";
import { useGameStore } from "@/service/game/GameStore";
import { EventMessage } from "@/service/game/EventMessage";
import { reactive, readonly } from "vue";
import { User } from "./login/User";

const lobbyState = reactive({
  users: new Array<User>(),
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
 * send request to pick a available role
 * @param role: the role which was picked from the user
 * @param lobbyKey: identifying key of lobby that sould be joined
 * @param username: identifying name of user that should join lobby
 */
async function updateRole(role: string, lobbyKey: string, username: string) {
  const eventMessage = new EventMessage("ROLE_PICK", lobbyKey, username, role);
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
    lobbyState.selectedRole = role;
  });
}

/**
 * send request to get every role which exists
 * @param lobbyKey: identifying key of lobby that sould be joined
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
 * @param lobbyKey: identifying key of lobby that sould be joined
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
      const tempUsers = lobbyState.users;
      lobbyState.users = [];

      response.forEach((username: string) => {
        const foundUser: User | undefined = tempUsers.find(
          (user) => user.username === username
        );
        if (foundUser) {
          lobbyState.users.push(foundUser);
        } else {
          lobbyState.users.push(new User(username));
        }
      });

      sessionStorage.setItem("users", JSON.stringify(lobbyState.users));
    });
}

/**
 * send request to get all labyrinths in database that can be selected for game
 * sets the labyrinthOtions in the lobbyState with all labyrinth ids if request was successful
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
  const eventMessage = new EventMessage(
    "LABYRINTH_PICK",
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
 * sets the new Labyrinth in the Dropdownmenu
 * @param selectedLabyrinth : id of the new selected Labyrinth
 */
function setLabyrinthSelection(selectedLabyrinth: number) {
  lobbyState.selectedLabyrinth = selectedLabyrinth;
}

/**
 * sends a List of two Arguments to the BE, so there can be checked, whether every Player is ready or not
 * (and reacts to a wrong respond after recieving it)
 * @param username: name of the user in the backend, which shall be taken out of the lobby
 * @param labId : id of the blueprint labyrinth, used for the Game Progression
 */
function readyCheck(username: string, labId: number) {
  const { gameState } = useGameStore();
  const args: string[] = [];
  args.push(username);
  args.push(String(labId));

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

/**
 * Finds the right user in the users list via the username param and sets the given ReadyState in it.
 * @param username : The username (from the BE) of the user which pressed the "Ready" Button
 * @param readyState : The state to determine whether the given user is ready or not
 */
function setUserReadyState(username: string, readyState: boolean) {
  lobbyState.users
    .find((user) => user.username == username)
    ?.setReady(readyState);
}

/**
 * Initial game setup when all users are ready:
 * 1. Gathering the labyrinth informations from the BE
 * 2. Updating the Users one last time, so they can transferred to the gameState properly
 * 3. Setting up new Players on the basis of the users in the users list
 * 4. Overwriting the the page history by replacing the url to the game view
 */
function setupGame() {
  const { updateGameData, gameState, setPlayerData } = useGameStore();
  updateGameData().then(() => {
    updateUsers(gameState.lobbyKey);
    lobbyState.users.forEach((user, index) => {
      console.log(user.username);
      console.log(gameState.labyrinth.playerStartTileIds[index]);
      setPlayerData(
        user.username,
        gameState.labyrinth.playerStartTileIds[index]
      );
    });

    router.replace(`/game/${gameState.lobbyKey}`);
  });
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
    setUserReadyState,
    lobbyState: readonly(lobbyState),
  };
}
