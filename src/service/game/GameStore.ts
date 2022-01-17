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
  started: false,
  errormessage: "",
  score: 0,
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
}

async function updateInventory(inventory: Array<Item>) {
  console.log(inventory);
  gameState.mainPlayer.setInventory(inventory);
  console.log("INVENTORY", gameState.mainPlayer.getInventory());
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
    updateGameData,
    updatePlayerData,
    updateInventory,
    setPlayerData,
    setLobbyKey,
    setError,
    getPlayer,
    startGame,
    endGame,
  };
}
