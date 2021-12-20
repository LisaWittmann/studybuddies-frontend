import { MoveOperation } from "@/service/game/EventMessage";

async function playerMovement(moveOperation: MoveOperation) {
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
  return fetch("/api/lobby/players/" + lobbyKey, {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      console.log("PLAYER POSITIONS");
      return response.json();
    })
    .then((jsondata) => {
      const playerPosition = new Map<string, number>();
      for (const key in jsondata) {
        playerPosition.set(key, Number(jsondata[key]));
      }
      return playerPosition;
    });
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
