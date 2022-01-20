import { reactive } from "vue";
import { useGameStore } from "@/service/game/GameStore";
import { useLoginStore } from "@/service/login/LoginStore";
import { useAppService } from "@/service/AppService";
import { EventMessage, Operation } from "@/service/game/EventMessage";
import { Message, Response } from "@/service/game/Conversation";
import { Orientation } from "@/service/labyrinth/Tile";
import { Item } from "@/service/labyrinth/Item";

const { gameState, updateInventory, endGame } = useGameStore();
const { setFeedback } = useAppService();

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
  await getConversationMessage("1.1");
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
          givePlayerItem(
            gameState.lobbyKey,
            conversation.message.itemName,
            gameState.mainPlayer.getUsername()
          );
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
      gameEventMessage.message = jsonData.accessText;
      if (jsonData.firstAccess) {
        gameEventMessage.state = "success";
        deleteFromInventory();
      } else if (jsonData.access) {
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
  const { gameState } = useGameStore();
  const { loginState } = useLoginStore();
  const eventMessage = new EventMessage(
    Operation[Operation.CHECK_END],
    gameState.lobbyKey,
    loginState.username,
    modelName.toUpperCase()
  );
  fetch("/api/lobby/end", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
 * @param itemId contains id of clicked body
 */
async function clickItem(modelName: string, itemId: string) {
  fetch("/api/lobby/click/" + modelName, { method: "GET" })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then((jsonData) => {
      const operation = (<any>Operation)[jsonData];
      console.log("click");
      switch (operation) {
        case Operation.ACCESS:
          checkAccess(modelName);
          break;
        case Operation.CONVERSATION:
          startConversation(modelName);
          break;
        case Operation.COLLECT:
          addToInventory(
            gameState.lobbyKey,
            itemId,
            gameState.mainPlayer.getUsername()
          );
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

function playerLeftGame(username: string) {
  endGame();
  setFeedback(
    `Spieler ${username} hat das Spiel verlassen.`,
    undefined,
    "/find",
    "Zurück zur Lobbyfindung"
  );
}

/**
 * adds item to inventory via fetch and updates frontend representation accordingly
 * calls method to delete collected item from tile
 * @param lobbyKey the key of the lobby
 * @param itemId id of the clicked item
 * @param username username of player that collects item
 */
async function addToInventory(
  lobbyKey: string,
  itemId: string,
  username: string
) {
  return fetch(
    "api/lobby/" + lobbyKey + "/username/" + username + "/item/" + itemId,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  )
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then((jsonData) => {
      updateInventory(jsonData);
      removeItemFromTile(lobbyKey, itemId);
    })
    .catch((error) => {
      console.error(error);
    });
}

/**
 * deletes item from inventory after pc was activated
 */
async function deleteFromInventory() {
  const { gameState } = useGameStore();
  const { loginState } = useLoginStore();
  const eventMessage = new EventMessage(
    Operation[Operation.DELETE],
    gameState.lobbyKey,
    loginState.username,
    ""
  );
  fetch("api/lobby/current-inventory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventMessage),
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then((jsonData) => {
      const inventory: Item[] = jsonData;
      updateInventory(inventory);
    })
    .catch((error) => {
      console.error(error);
    });
}

/**
 *
 * Adds items from NPC to inventory of player
 *
 * @param lobbyKey
 * @param itemName
 * @param username
 */
async function givePlayerItem(
  lobbyKey: string,
  itemName: string,
  username: string
) {
  return fetch(
    "api/lobby/" +
      lobbyKey +
      "/username/" +
      username +
      "/give/item/" +
      itemName,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  )
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then((jsonData) => {
      const inventory: Item[] = jsonData;
      updateInventory(inventory);
    })
    .catch((error) => {
      console.error(error);
    });
}

/**
 * Provides functionality to remove an item from a tile.
 * @param lobbyKey the key of the lobby
 * @param itemId the id of the object that is to be deleted
 */
async function removeItemFromTile(lobbyKey: string, itemId: string) {
  return fetch("api/lobby/" + lobbyKey + "/item/" + itemId, {
    method: "DELETE",
    headers: { "Content-Type": "text/plain" },
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
    })
    .catch((error) => {
      console.error(error);
    });
}

/**
 *
 * Moves item from mainplayer to partner
 *
 * @param username
 * @param itemId
 */
async function tradeItem(username: string, itemId: string) {
  return fetch(
    "api/lobby/" +
      gameState.lobbyKey +
      "/username/" +
      username +
      "/trade/item/" +
      itemId,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  )
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then((jsonData) => {
      const inventory: Item[] = jsonData;
      updateInventory(inventory);
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
    getConversationMessage,
    endConversation,
    conversation,
    playerLeftGame,
    tradeItem,
  };
}
