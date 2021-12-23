import { MoveOperation } from "@/service/game/EventMessage";
import { Message, Response } from "@/service/game/Conversation";
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

// send the clicked item id to backend
async function selectItem(itemId: number) {
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
  return {
    eventMessage,
    toggleEventMessage,
    playerMovement,
    selectItem,
    conversation,
    startConversation,
    getConversationMessage,
  };
}
