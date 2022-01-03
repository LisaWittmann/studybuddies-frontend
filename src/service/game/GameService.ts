import { reactive } from "vue";
import { useGameStore } from "@/service/game/GameStore";
import { useLoginStore } from "../login/LoginStore";
import { EventMessage, Operation } from "@/service/game/EventMessage";

const eventMessage = reactive({
  message: "",
  state: "",
  visible: false,
});

const toggleEventMessage = () => (eventMessage.visible = !eventMessage.visible);

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

async function checkAccess(modelName: string) {
  const { gameState } = useGameStore();
  const { loginState } = useLoginStore();
  fetch(
    `/api/body/access/${modelName}/${gameState.lobbyKey}/${loginState.username}`,
    {
      method: "GET",
    }
  )
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then((jsonData) => {
      eventMessage.message = jsonData.accesstext;
      if (jsonData.access) {
        eventMessage.state = "success";
      } else {
        eventMessage.state = "warning";
      }
      eventMessage.visible = true;
    })
    .catch((error) => {
      console.error(error);
    });
}

async function clickItem(modelName: string) {
  console.log("click", modelName);
  fetch("/api/body/click/" + modelName, { method: "GET" })
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
    eventMessage,
    toggleEventMessage,
    playerMovement,
    clickItem,
  };
}
