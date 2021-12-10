import router from "@/router";

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
 * @param filelist: list of selected labyrinth for upload
 */
async function uploadJsonFiles(filelist: FileList) {
  if (filelist) {
    for (const file of filelist) {
      const data = new FormData();
      data.append("labFile", file);
      fetch("/api/labyrinth/read", {
        method: "POST",
        body: data,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .catch((error) => console.error(error));
    }
  }
}

/**
 * send request to get all current users by username in lobby
 * @param lobbyKey: indentifying key of lobby which users should be requested
 * @returns promise containing the list of users if request was successfull
 * @throws error if request was not successfull
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
 * send request to get all labyrinths in database that can be selected for game
 * @returns promise containing list of all labyrinth ids if request was successfull
 * @throws error if request was not successfull
 */
async function updateLabyrinths() {
  return fetch("/api/labyrinth/ids").then((response) => {
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  });
}

/**
 * send request to set ready status of user in lobby
 * @param lobbyKey: identifying key of the lobby
 * @param username: identifying name of the user which status should be set
 */
async function readyCheck(lobbyKey: string, username: string) {
  fetch(`/api/lobby/${lobbyKey}/ready`, {
    method: "POST",
    body: username,
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
    })
    .catch((error) => console.error(error));
}

export function useLobbyService() {
  return {
    joinLobby,
    createLobby,
    exitLobby,
    uploadJsonFiles,
    updateUsers,
    updateLabyrinths,
    readyCheck,
  };
}
