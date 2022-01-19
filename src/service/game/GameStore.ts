import { reactive } from "vue";

import { useLoginStore } from "@/service/login/LoginStore";
import { useLabyrinthStore } from "@/service/labyrinth/LabyrinthStore";

import { Item } from "@/service/labyrinth/Item";
import { Labyrinth } from "@/service/labyrinth/Labyrinth";
import { MainPlayer, PartnerPlayer } from "@/service/game/Player";

const { updateLabyrinthData } = useLabyrinthStore();

/**
 * Errormessage: To display all kind of Errors in the according scene
 */
const gameState = reactive({
  lobbyKey: "",
  labyrinthName: "",
  labyrinth: new Labyrinth("", 0, []),
  mainPlayer: new MainPlayer("", 0),
  partnerPlayer: new PartnerPlayer("", 0),
  started: false,
  errormessage: "",
  score: 0,
  playersInSameTile: false,
});

function updateGameData() {
  return updateLabyrinthData(gameState.lobbyKey).then(
    (labyrinth) => (gameState.labyrinth = labyrinth)
  );
}

function startGame() {
  gameState.started = true;
}

function endGame() {
  gameState.started = false;
  gameState.labyrinthName = "";
  gameState.labyrinth = new Labyrinth("", 0, []);
  gameState.mainPlayer = new MainPlayer("", 0);
  gameState.partnerPlayer = new PartnerPlayer("", 0);
  gameState.errormessage = "";
  gameState.score = 0;
  gameState.playersInSameTile = false;
}

/**
 * Updates the Player so, the watcher can build the changes
 * @param username: username of the player which position will be updated
 * @param newPosition: sets new position of player
 */
function updatePlayerData(username: string, newPosition: number) {
  if (username == gameState.mainPlayer.getUsername()) {
    gameState.mainPlayer.setPosition(newPosition);
  } else if (username == gameState.partnerPlayer.getUsername()) {
    gameState.partnerPlayer.setPosition(newPosition);
    console.log("NEW POSITION: ", newPosition);
  }
  checkPlayerProximity();
}

/**
 * Updates complete inventory after delete or collect
 * @param inventory
 */
async function updateInventory(inventory: Array<Item>) {
  console.log(inventory);
  gameState.mainPlayer.setInventory(inventory);
}

/**
 * Adds a single traded item to inventory after eventmessage was sent
 * @param item
 */
async function addItemToInventory(item: Item) {
  gameState.mainPlayer.addItem(item);
}

/**
 * sets a Player with its username and the startTileId
 * @param username : name of the user to improve identification between Main- and Partnerplayer
 * @param startTileId : start position of the player at the start of the game
 */
async function setPlayerData(username: string, startTileId: number) {
  console.log("Starttileid is: " + startTileId + " Playername is: " + username);
  const { loginState } = useLoginStore();
  if (loginState.username == username) {
    gameState.mainPlayer = new MainPlayer(username, startTileId);
  } else {
    gameState.partnerPlayer = new PartnerPlayer(username, startTileId);
  }
}

/**
 * Provides a way to check if both players are in the same tile
 */
function checkPlayerProximity() {
  gameState.playersInSameTile = gameState.mainPlayer.position == gameState.partnerPlayer.position;
}

async function setLobbyKey(lobbyKey: string) {
  gameState.lobbyKey = lobbyKey;
}

async function setError(error: string) {
  gameState.errormessage = error;
}

async function setScore(score: string) {
  gameState.score = Number(score);
  sessionStorage.setItem("score", score);
}

function getPlayer(username: string) {
  if (gameState.mainPlayer.username == username) {
    return gameState.mainPlayer;
  } else if (gameState.partnerPlayer.username == username) {
    return gameState.partnerPlayer;
  }
}

export function useGameStore() {
  return {
    gameState,
    updateGameData,
    updatePlayerData,
    updateInventory,
    addItemToInventory,
    setPlayerData,
    setLobbyKey,
    setError,
    setScore,
    getPlayer,
    startGame,
    endGame,
  };
}