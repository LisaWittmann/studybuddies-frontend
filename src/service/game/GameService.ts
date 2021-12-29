import { MoveOperation, Operation } from "@/service/game/EventMessage";
import { Message } from "@/service/game/Conversation";
import { reactive } from "vue";

// in-game messages like warnings, errors, hints ...
const eventMessage = reactive({
  message: "Dieser Computer ist passwortgeschützt. Kein Zugriff möglich!",
  state: "warning",
  visible: false,
});

const toggleEventMessage = () => (eventMessage.visible = !eventMessage.visible);

// conversations with interactive game characters
const conversation = reactive({
  character: "",
  message: new Message("", "", undefined, []),
  visible: false,
});

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
      conversation.message = jsonData as Message;
    })
    .catch(() => {
      conversation.visible = false;
      conversation.message = new Message("", "", undefined, []);
      conversation.character = "";
    });
}

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

async function checkAccess(modelName: string) {
  console.log("CHECK ACCESS");
  fetch(`/api/body/access/${modelName}`, {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then((jsonData) => {
      console.log(jsonData);
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
        case Operation.CONVERSATION:
          startConversation(modelName);
          break;
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
    conversation,
    startConversation,
    getConversationMessage,
  };
}
