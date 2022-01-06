import { reactive } from "vue";
import { useGameStore } from "@/service/game/GameStore";
import { useLoginStore } from "../login/LoginStore";
import { EventMessage, Operation } from "@/service/game/EventMessage";
import { Message } from "@/service/game/Conversation";

const gameEventMessage = reactive({
  message: "",
  state: "",
  visible: false,
});

// conversations with interactive game characters
const conversation = reactive({
  character: "",
  message: new Message("", "", undefined, []),
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
      return response.json();
    })
    .catch((error) => {
      console.error(error);
    });
  }


async function startConversation(character: string) {
  conversation.character = character;
  conversation.visible = true;
  getConversationMessage("1.1");
}

async function getConversationMessage(id: string) {
  fetch(`/api/body/npc/${conversation.character}/${id}`, {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then((jsonData) => {
      console.log(jsonData);

      if ((jsonData as Message).id == "0.0") {
        console.log("endConversation");
        endConversation()
        return
      }

      conversation.message = jsonData as Message;
      if (conversation.message.itemName != null) {
        console.log("give Item");
      }
    })
    .catch(() => {
      endConversation();
    });
}

async function endConversation() {
  conversation.visible = false;
  conversation.message = new Message("", "", undefined, []);
  conversation.character = "";
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
        case Operation.CONVERSATION:
          console.log("test");
          startConversation(modelName);
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
    startConversation,
    getConversationMessage,
    conversation,
  };
}
