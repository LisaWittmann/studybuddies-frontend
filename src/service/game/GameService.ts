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
  return { playerMovement, itemSelection };
}
