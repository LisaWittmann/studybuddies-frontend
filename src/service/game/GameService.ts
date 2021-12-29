import { MoveOperation } from "@/service/game/EventMessage";
import { useGameStore } from "./GameStore";

async function playerMovement(moveOperation: MoveOperation) {
  console.log(
    moveOperation.username,
    moveOperation.lobbyKey,
    moveOperation.operation,
    moveOperation.data
  );
  fetch("/api/lobby/move", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(moveOperation),
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
    })
    .catch((error) => {
      console.error(error);
    });
}

// fetches the current tileId of both players
async function updatePlayerPositions(lobbyKey: string) {
  //const { setPlayerData } = useGameStore();

  return fetch("/api/lobby/players/" + lobbyKey, {
    method: "GET",
  }).then((response) => {
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  });
  /* .then((jsondata) => {
      for (const key in jsondata) {
        setPlayerData(key, Number(jsondata[key]));
      }
    }); */
}

// send the clicked item id to backend
async function itemSelection(itemId: number) {
  fetch("/api/click/" + itemId, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemId),
  }).catch((error) => {
    console.error(error);
  });
}

export function useGameService() {
  return { playerMovement, itemSelection, updatePlayerPositions };
}
