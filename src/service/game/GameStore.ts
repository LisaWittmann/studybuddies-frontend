import { reactive } from "vue";
import { MainPlayer, PartnerPlayer } from "@/service/game/Player";
import { useLabyrinthStore } from "@/service/labyrinth/LabyrinthStore";
import { useLoginStore } from "@/service/login/LoginStore";
import { Item } from "../labyrinth/Item";
import { Labyrinth } from "@/service/labyrinth/Labyrinth";

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
  loading: false,
  errormessage: "",
  score: 0,
  playersInSameTile: false,
});

function setGameState(
  lobbyKey: string | null,
  labyrinthName: string | null,
  labyrinth: string | null,
  mainPlayer: string | null,
  partnerPlayer: string | null,
  errormessage: string | null,
  score: string | null,
  playersInSameTile: string | null
) {
  if (lobbyKey) gameState.lobbyKey = lobbyKey;
  if (labyrinthName) gameState.labyrinthName = JSON.parse(labyrinthName);
  if (labyrinth) gameState.labyrinth = JSON.parse(labyrinth) as Labyrinth;
  if (mainPlayer) {
    Object.assign(gameState.mainPlayer, JSON.parse(mainPlayer));
  }
  if (partnerPlayer) {
    Object.assign(gameState.partnerPlayer, JSON.parse(partnerPlayer));
  }
  if (errormessage) gameState.errormessage = errormessage;

  if (score) gameState.score = JSON.parse(score) as number;
  if (playersInSameTile)
    gameState.playersInSameTile = JSON.parse(playersInSameTile) as boolean;
}

function setGameSessionStorage() {
  sessionStorage.setItem("lobbyKey", JSON.stringify(gameState.lobbyKey));
  sessionStorage.setItem(
    "selectedLabyrinthName",
    JSON.stringify(gameState.labyrinthName)
  );
  sessionStorage.setItem("labyrinth", JSON.stringify(gameState.labyrinth));
  sessionStorage.setItem("mainPlayer", JSON.stringify(gameState.mainPlayer));
  sessionStorage.setItem(
    "partnerPlayer",
    JSON.stringify(gameState.partnerPlayer)
  );
  sessionStorage.setItem(
    "errormessage",
    JSON.stringify(gameState.errormessage)
  );
  sessionStorage.setItem("score", JSON.stringify(gameState.score));
  sessionStorage.setItem(
    "playersInSameTile",
    JSON.stringify(gameState.playersInSameTile)
  );
}

function getGameSessionStorage() {
  setGameState(
    sessionStorage.getItem("lobbyKey"),
    sessionStorage.getItem("selectedLabyrinth"),
    sessionStorage.getItem("labyrinth"),
    sessionStorage.getItem("mainPlayer"),
    sessionStorage.getItem("partnerPlayer"),
    sessionStorage.getItem("errormessage"),
    sessionStorage.getItem("score"),
    sessionStorage.getItem("playersInSameTile")
  );
}

function updateGameData() {
  return updateLabyrinthData(gameState.lobbyKey).then(
    (labyrinth) => (gameState.labyrinth = labyrinth)
  );
}

/**
 * Updates the Player so, the watcher can build the changes
 * Adds changed Player to sessionStorage
 * @param username: username of the player which position will be updated
 * @param newPosition: sets new position of player
 */
function updatePlayerData(username: string, newPosition: number) {
  if (username == gameState.mainPlayer.getUsername()) {
    gameState.mainPlayer.setPosition(newPosition);
    sessionStorage.setItem("mainPlayer", JSON.stringify(gameState.mainPlayer));
  } else if (username == gameState.partnerPlayer.getUsername()) {
    gameState.partnerPlayer.setPosition(newPosition);
    console.log("NEW POSITION: ", newPosition);
    sessionStorage.setItem(
      "partnerPlayer",
      JSON.stringify(gameState.partnerPlayer)
    );
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
  if (gameState.mainPlayer.position == gameState.partnerPlayer.position) {
    gameState.playersInSameTile = true;
  } else {
    gameState.playersInSameTile = false;
  }
}

async function setLobbyKey(lobbyKey: string) {
  gameState.lobbyKey = lobbyKey;
  sessionStorage.setItem("lobbyKey", lobbyKey);
}

async function setError(error: string) {
  gameState.errormessage = error;
  sessionStorage.setItem("errormessage", error);
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
    setGameState,
    updateGameData,
    updatePlayerData,
    updateInventory,
    addItemToInventory,
    setPlayerData,
    setLobbyKey,
    setError,
    getPlayer,
    setGameSessionStorage,
    getGameSessionStorage,
  };
}
