import { reactive, computed } from "vue";

import { useAppService } from "@/service/AppService";
import { useLabyrinthStore } from "@/service/labyrinth/LabyrinthStore";

import { Item } from "@/service/labyrinth/Item";
import { Labyrinth } from "@/service/labyrinth/Labyrinth";
import { MainPlayer, PartnerPlayer } from "@/service/game/Player";

const { updateLabyrinthData } = useLabyrinthStore();
const { globalState } = useAppService();

const loggedInUser = computed(() => globalState.username);

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

function setStarted(started: boolean) {
  gameState.started = started;
}

function setLobbyKey(lobbyKey: string) {
  gameState.lobbyKey = lobbyKey;
}

function setError(error: string) {
  gameState.errormessage = error;
}

function setScore(score: number) {
  gameState.score = score;
}

function resetGameState() {
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
 * Updates complete inventory after delete or collect
 * @param inventory
 */
function setInventory(inventory: Array<Item>) {
  gameState.mainPlayer.setInventory(inventory);
}

function getPlayer(username: string) {
  if (gameState.mainPlayer.username == username) {
    return gameState.mainPlayer;
  } else if (gameState.partnerPlayer.username == username) {
    return gameState.partnerPlayer;
  }
}

/**
 * sets a Player with its username and the startTileId
 * @param username : name of the user to improve identification between Main- and Partnerplayer
 * @param startTileId : start position of the player at the start of the game
 */
function setPlayerData(username: string, startTileId: number) {
  if (loggedInUser.value == username) {
    gameState.mainPlayer = new MainPlayer(username, startTileId);
  } else {
    gameState.partnerPlayer = new PartnerPlayer(username, startTileId);
  }
}

/**
 * Updates the Player so, the watcher can build the changes
 * @param username: username of the player which position will be updated
 * @param newPosition: sets new position of player
 */
function updatePlayerData(username: string, newPosition: number) {
  console.log(username, newPosition);
  console.log(loggedInUser.value);
  console.log(gameState.partnerPlayer.getUsername());
  if (loggedInUser.value == username) {
    gameState.mainPlayer.setPosition(newPosition);
  } else if (username == gameState.partnerPlayer.getUsername()) {
    gameState.partnerPlayer.setPosition(newPosition);
  }
  checkPlayerProximity();
}

/**
 * Provides a way to check if both players are in the same tile
 */
function checkPlayerProximity() {
  gameState.playersInSameTile =
    gameState.mainPlayer.position == gameState.partnerPlayer.position;
}

async function updateGameData() {
  return updateLabyrinthData(gameState.lobbyKey).then(
    (labyrinth) => (gameState.labyrinth = labyrinth)
  );
}

export function useGameStore() {
  return {
    gameState,
    getPlayer,
    setLobbyKey,
    setScore,
    setStarted,
    setError,
    setInventory,
    resetGameState,
    setPlayerData,
    updatePlayerData,
    updateGameData,
  };
}
