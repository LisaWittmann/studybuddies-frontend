import router from "@/router";

/**
 * post selected json file to api to read in labyrinth model
 * @param filelist: list of selected labyrinth for upload
 */
async function uploadJsonFiles(filelist: FileList) {
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
        })
        .catch((error) => {
          console.error(error);
        });
    }
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
  return fetch("/api/labyrinth/keys").then((response) => {
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

function confirmSettings() {
  //TODO: functionality if both players clicked on ready button
  alert("Game should start now!");
}

export function useLobbyService() {
  return {
    uploadJsonFiles,
    updateUsers,
    updateLabyrinths,
    confirmSettings,
    exitLobby,
  };
}
