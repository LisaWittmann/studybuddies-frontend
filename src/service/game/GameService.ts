import { reactive } from "vue";
import { useGameStore } from "@/service/game/GameStore";
import { useLoginStore } from "../login/LoginStore";
import { EventMessage, Operation } from "@/service/game/EventMessage";

const gameEventMessage = reactive({
  message: "",
  state: "",
  visible: false,
});

const toggleEventMessage = () => (gameEventMessage.visible = !gameEventMessage.visible);

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

// fetches the current tileId of both players
async function updatePlayerPositions(lobbyKey: string) {
  return fetch("/api/lobby/players/" + lobbyKey, {
    method: "GET",
  }).then((response) => {
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  });
}

async function checkAccess(modelName: string) {
  const { gameState } = useGameStore();
  const { loginState } = useLoginStore();
  const eventMessage = new EventMessage(
    Operation[Operation.ACCESS],
    gameState.lobbyKey,
    loginState.username,
    modelName.toUpperCase()
  );
  fetch("/api/lobby/access", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventMessage),
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then((jsonData) => {
      gameEventMessage.message = jsonData.accesstext;
      if (jsonData.access) {
        gameEventMessage.state = "success";
      } else {
        gameEventMessage.state = "warning";
      }
      gameEventMessage.visible = true;
    })
    .catch((error) => {
      console.error(error);
    });
}

async function clickItem(modelName: string) {
  console.log("click", modelName);
  fetch("/api/lobby/click/" + modelName, { method: "GET" })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then((jsonData) => {
      const operation = (<any>Operation)[jsonData];
      console.log(operation);
      switch (operation) {
        case Operation.ACCESS:
          checkAccess(modelName);
          break;
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

export function useGameService() {
  return {
    gameEventMessage,
    toggleEventMessage,
    updatePlayerPositions,
    playerMovement,
    clickItem,
  };
}
