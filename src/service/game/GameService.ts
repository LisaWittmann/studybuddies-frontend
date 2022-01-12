import { computed, reactive } from "vue";
import { useGameStore } from "@/service/game/GameStore";
import { useLoginStore } from "@/service/login/LoginStore";
import { EventMessage, Operation } from "@/service/game/EventMessage";
import { Message } from "@/service/game/Conversation";
import { Orientation } from "@/service/labyrinth/Tile";
import { Item } from "../labyrinth/Item";

const { updateInventory } = useGameStore();

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

const { gameState } = useGameStore();

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
 * @param character modelName of charachter
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

/**
 * request operation of clicked item
 * @param modelName name of clicked item
 */
async function clickItem(modelName: string, itemId: string) {
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
        case Operation.COLLECT:
          addToInventory(
            gameState.lobbyKey,
            itemId,
            modelName,
            gameState.mainPlayer.getUsername()
          );
          // removeItemFromTile(gameState.lobbyKey, itemId);
          break;
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

async function addToInventory(
  lobbyKey: string,
  itemId: string,
  modelName: string,
  username: string
) {
  //"/lobby/{key}/username/{username}/item/{itemId}"

  return fetch("api/lobby/" + lobbyKey + "/username/" + username + "/item/" + itemId, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then((jsonData) => {
      let inventory = new Array<Item>();
      inventory = jsonData;
      updateInventory(inventory);
      removeItemFromTile(lobbyKey, itemId);
    })
    .catch((error) => {
      console.error(error);
    });
}

async function givePlayerItem(
    lobbyKey: string,
    itemName: string,
    username: string
) {
  //"/lobby/{key}/username/{username}/give/item/{itemName}"

  return fetch("api/lobby/" + lobbyKey + "/username/" + username + "/give/item/" + itemName, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then((jsonData) => {
        let inventory = new Array<Item>();
        inventory = jsonData;
        updateInventory(inventory);
      })
      .catch((error) => {
        console.error(error);
      });
}

/**
 * Provides functionality to remove an item from a tile.
 * @param lobbyKey the key of the lobby
 * @param objectName the name of the object that is to be deleted
 * @param itemId the id of the object that is to be deleted
 */
async function removeItemFromTile(
  lobbyKey: string,
  itemId: string
) {
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

export function useGameService() {
  return {
    gameEventMessage,
    toggleEventMessage,
    movePlayer,
    clickItem,
    startConversation,
    getConversationMessage,
    conversation,
  };
}
