import { EventMessage } from "@/service/game/EventMessage";
import { Object3D } from "three";
import { useGameStore } from "./GameStore";

const { gameState } = useGameStore();

async function playerMovement(evenMessage: EventMessage) {
  fetch("/api/lobby/move", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(evenMessage),
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
    })
    .catch((error) => {
      console.error(error);
    });
}

// send the clicked item id to backend
async function itemSelection(model: Object3D) {
  const lobbyKey = gameState.lobbyKey;
  fetch("/api/lobby/" + lobbyKey + "/item/" + model.id + "/strategy", {
    method: "GET",
    headers: {
      "Content-Type": "text/plain",
    },
  })
    .then((response) => {
      if (response.ok) {
        fetch("/api/lobby/" + lobbyKey + "/item/" + model.id, {
          method: "DELETE",
          headers: {
            "Content-Type": "text/plain",
          },
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

export function useGameService() {
  return { playerMovement, itemSelection };
}
