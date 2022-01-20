import { computed, reactive } from "vue";
import { useGameStore } from "@/service/game/GameStore";
import { useLobbyService } from "@/service/lobby/LobbyService";

import { EventMessage, Operation } from "@/service/game/EventMessage";
import { Message, Response } from "@/service/game/Conversation";
import { Orientation } from "@/service/labyrinth/Tile";
import { Item } from "@/service/labyrinth/Item";

const { gameState, setInventory, resetGameState, setStarted } = useGameStore();
const { exitLobby } = useLobbyService();

const lobbyKey = computed(() => gameState.lobbyKey);
const playerName = computed(() => gameState.mainPlayer.username);

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

function setGameEvent(message: string, state?: string) {
  gameEventMessage.message = message;
  gameEventMessage.state = state ? state : "";
  gameEventMessage.visible = true;
}

function resetGameEvent() {
  gameEventMessage.visible = false;
  gameEventMessage.message = "";
  gameEventMessage.state = "";
}

function toggleEventMessage() {
  gameEventMessage.visible = !gameEventMessage.visible;
}

/**
 * function which is used when clicking the arrow in Scene
 * By receiving the Orientation it creates an EventMessage as Move-Operation to send it to the BE via GameService Methode
 * @param orientation used in the backend to identify the direction to move the player
 */
async function movePlayer(orientation: Orientation) {
  const eventMessage = new EventMessage(
    Operation[Operation.MOVEMENT],
    lobbyKey.value,
    playerName.value,
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
function startConversation(character: string) {
  conversation.character = character;
  conversation.visible = true;
  getConversationMessage("1.1");
}

/**
 * set conversation state to default values to end conversation
 */
function endConversation() {
  conversation.visible = false;
  conversation.message = new Message("", "", undefined, []);
  conversation.character = "";
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
      conversation.message = jsonData as Message;
      if (conversation.message.id != "0.0") {
        if (conversation.message.itemName != null) {
          givePlayerItem(conversation.message.itemName);
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
 * request access to clicked item
 * display incoming data as gameEventMessage
 * @param modelName name of the clicked item
 */
async function checkAccess(modelName: string) {
  const eventMessage = new EventMessage(
    Operation[Operation.ACCESS],
    lobbyKey.value,
    playerName.value,
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
      let state = "success";
      if (jsonData.firstAccess) updateInventory();
      else if (!jsonData.access) state = "warning";
      setGameEvent(jsonData.accessText, state);
    })
    .catch((error) => {
      console.error(error);
    });
}

async function checkEndGame(modelName: string) {
  const eventMessage = new EventMessage(
    Operation[Operation.CHECK_END],
    lobbyKey.value,
    playerName.value,
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
async function clickItem(modelName: string, itemId: number) {
  fetch("/api/lobby/click/" + modelName, { method: "GET" })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then((jsonData) => {
      switch ((<any>Operation)[jsonData]) {
        case Operation.ACCESS:
          checkAccess(modelName);
          break;
        case Operation.CONVERSATION:
          startConversation(modelName);
          break;
        case Operation.COLLECT:
          addToInventory(itemId);
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

/**
 * adds item to inventory via fetch and updates frontend representation accordingly
 * calls method to delete collected item from tile
 * @param lobbyKey the key of the lobby
 * @param itemId id of the clicked item
 * @param username username of player that collects item
 */
async function addToInventory(itemId: number) {
  return fetch(
    "api/lobby/" +
      lobbyKey.value +
      "/username/" +
      playerName.value +
      "/item/" +
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
      setInventory(inventory);
      removeItemFromLabyrinth(itemId);
    })
    .catch((error) => {
      console.error(error);
    });
}

/**
 * deletes item from inventory after pc was activated
 */
async function updateInventory() {
  const eventMessage = new EventMessage(
    Operation[Operation.DELETE],
    lobbyKey.value,
    playerName.value,
    ""
  );
  fetch("/api/lobby/current-inventory", {
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
      setInventory(inventory);
    })
    .catch((error) => {
      console.error(error);
    });
}

/**
 * Adds items from NPC to inventory of player
 * @param itemName
 */
async function givePlayerItem(itemName: string) {
  return fetch(
    "/api/lobby/" +
      lobbyKey.value +
      "/username/" +
      playerName.value +
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
      setInventory(inventory);
    })
    .catch((error) => {
      console.error(error);
    });
}

/**
 * Provides functionality to remove an item from a tile.
 * @param itemId the id of the object that is to be deleted
 */
async function removeItemFromLabyrinth(itemId: number) {
  return fetch("/api/lobby/" + lobbyKey.value + "/item/" + itemId, {
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
 * Moves item from mainplayer to partner
 * @param itemId
 */
async function tradeItem(itemId: number) {
  return fetch(
    "/api/lobby/" +
      lobbyKey.value +
      "/username/" +
      playerName.value +
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
      setInventory(inventory);
    })
    .catch((error) => {
      console.error(error);
    });
}

function endGame() {
  resetGameEvent();
  endConversation();
  setStarted(false);
}

/**
 * reset all states to force game end and remove player from lobby
 */
function forceGameEnd() {
  endGame();
  exitLobby();
  resetGameState();
}

export function useGameService() {
  return {
    gameEventMessage,
    toggleEventMessage,
    resetGameEvent,
    movePlayer,
    clickItem,
    getConversationMessage,
    endConversation,
    conversation,
    updateInventory,
    tradeItem,
    endGame,
    forceGameEnd,
  };
}
