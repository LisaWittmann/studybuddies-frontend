import { reactive } from "vue";
import { useGameStore } from "@/service/game/GameStore";
import { useLoginStore } from "@/service/login/LoginStore";
import { EventMessage, Operation } from "@/service/game/EventMessage";
import { Message, Response } from "@/service/game/Conversation";
import { Orientation } from "@/service/labyrinth/Tile";
import router from "@/router";

const gameEventMessage = reactive({
  message: "",
  state: "",
  visible: false,
});

const conversation = reactive({
  character: "",
  message: new Message("", "", undefined, []),
  visible: false,
});

const toggleEventMessage = () =>
  (gameEventMessage.visible = !gameEventMessage.visible);

/**
 * function which is used when clicking the arrow in Scene
 * By receiving the Orientation it creates an EventMessage as Move-Operation to send it to the BE via GameService Methode
 * @param orientation used in the backend to identify the direction to move the player
 */
async function movePlayer(orientation: Orientation) {
  const { gameState } = useGameStore();
  const { loginState } = useLoginStore();
  const eventMessage = new EventMessage(
    Operation[Operation.MOVEMENT],
    gameState.lobbyKey,
    loginState.username,
    Orientation[orientation]
  );
  fetch("/api/lobby/move", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventMessage),
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .catch((error) => {
      console.error(error);
    });
}

/**
 * start conversation with a game character
 * @param character modelName of character
 */
async function startConversation(character: string) {
  conversation.character = character;
  conversation.visible = true;
  getConversationMessage("1.1");
}

/**
 * get next message of conversation with game character
 * @param id message id
 */
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

      if (conversation.message.id != "0.0") {
        if (conversation.message.itemName != null) {
          console.log("give Item");
        }
      } else {
        endConversation();
      }
    })
    .catch(() => {
      endConversation();
    });
}

/**
 * set conversation state to default values to end conversation
 */
async function endConversation() {
  conversation.visible = false;
  conversation.message = new Message("", "", undefined, []);
  conversation.character = "";
}

/**
 * request access to clicked item
 * display incoming data as gameEventMessage
 * @param modelName name of the clicked item
 */
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

async function checkEndGame(modelName: string) {
  const {gameState} = useGameStore();
  const {loginState} = useLoginStore();
  const eventMessage = new EventMessage(
      Operation[Operation.CHECK_END],
      gameState.lobbyKey,
      loginState.username,
      modelName.toUpperCase()
  );
  fetch("/api/lobby/end", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(eventMessage),
  })
      .then((response) => {
        conversation.visible = true;
        conversation.message = new Message(
            "",
            "",
            undefined,
            Array.of(new Response("", "", ""))
        );
        if (response.ok) {
          conversation.message.text =
              "Herzlichen Glückwunsch. Du kannst das Labyrinth verlassen. Warte bis dein Partner die Trophäe gesammelt hat.";
          conversation.message.responses = [];
        } else {
          conversation.message.responses[0].text = "Ich komme später wieder.";
          if (response.status == 409) {
            conversation.message.text =
                "Du hast noch nicht die zu erreichende Mindestpunktzahl erreicht.";
          } else if (response.status == 405) {
            conversation.message.text =
                "Du bist noch nicht zusammen mit deinem Partner am Ende angekommen.";
          } else if (response.status == 418) {
            conversation.message.text =
                "Tut mir leid, aber ich glaube die Trophäe ist für jemand anderen vorgesehen.";
          }
          conversation.message.text += " Versuch's später noch einmal.";
        }
      })
      .catch((error) => {
        console.error(error);
      });
}

/**
 * request operation of clicked item
 * @param modelName name of clicked item
 */
async function clickItem(modelName: string) {
  console.log("click", modelName);
  fetch("/api/lobby/click/" + modelName, { method: "GET" })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then((jsonData) => {
      const operation = (<any>Operation)[jsonData];
      switch (operation) {
        case Operation.ACCESS:
          checkAccess(modelName);
          break;
        case Operation.CONVERSATION:
          startConversation(modelName);
          break;
          case Operation.CHECK_END:
            checkEndGame(modelName);
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
    movePlayer,
    clickItem,
    startConversation,
    getConversationMessage,
    endConversation,
    conversation,
  };
}
