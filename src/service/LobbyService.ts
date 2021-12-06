import router from "@/router";
import { useLoginStore } from "@/service/login/LoginStore";

const { loginState } = useLoginStore();

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

function selectLabyrinth() {
  //TODO: functionality to confirm selected Labyrinth in dropdown menu
  // button shown and hidden depending on clicked item in dropdown
  alert("Confirm button clicked!");
}

function exitLobby(lobbyKey: number) {
  fetch("/api/lobby/leave/" + lobbyKey, {
    method: "POST",
    headers: {
      "Content-Type": "html/text;charset=utf-8",
    },
    body: loginState.username,
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
    selectLabyrinth,
    confirmSettings,
    exitLobby,
  };
}
