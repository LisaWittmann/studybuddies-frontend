import { reactive } from "vue";
import { MainPlayer, PartnerPlayer, Player } from "@/service/game/Player";
import { useLabyrinthStore } from "@/service/labyrinth/LabyrinthStore";
import { useLoginStore } from "@/service/login/LoginStore";
import { Labyrinth } from "@/service/labyrinth/Labyrinth";

const { labyrinthState, updateLabyrinthData } = useLabyrinthStore();

/**
 * Errormessage: To display all kind of Errors in the according scene
 */
const gameState = reactive({
  lobbyKey: "",
  labyrinthId: 1,
  labyrinth: labyrinthState,
  mainPlayer: new MainPlayer("", 0),
  partnerPlayer: new PartnerPlayer("", 0),
  errormessage: "",
  score: 0,
});

function setGameState(
  lobbyKey: string | null,
  labyrinthId: string | null,
  labyrinth: string | null,
  mainPlayer: string | null,
  partnerPlayer: string | null,
  errormessage: string | null,
  score: string | null
) {
  if (lobbyKey) gameState.lobbyKey = lobbyKey;
  if (labyrinthId) gameState.labyrinthId = JSON.parse(labyrinthId) as number;
  if (labyrinth) gameState.labyrinth = JSON.parse(labyrinth) as Labyrinth;
  if (mainPlayer) {
    Object.assign(gameState.mainPlayer, JSON.parse(mainPlayer));
  }
  if (partnerPlayer) {
    Object.assign(gameState.partnerPlayer, JSON.parse(partnerPlayer));
  }
  if (errormessage) gameState.errormessage = errormessage;
  if (score) gameState.score = JSON.parse(score) as number;
}

async function updateGameData() {
  await updateLabyrinthData(gameState.lobbyKey);
}

/**
 * Updates the Player so, the watcher can build the changes
 * Adds changed Player to sessionStorage
 * @param player: the new (changed) player object
 * @param newPosition: sets new position of player
 */
function updatePlayerData(player: Player, newPosition: number) {
  if (player.getUsername() == gameState.mainPlayer.getUsername()) {
    gameState.mainPlayer.setPosition(newPosition);
    sessionStorage.setItem("mainPlayer", JSON.stringify(gameState.mainPlayer));
  } else {
    gameState.partnerPlayer.setPosition(newPosition);
    console.log("NEW POSITION: ", newPosition);
    sessionStorage.setItem(
      "partnerPlayer",
      JSON.stringify(gameState.partnerPlayer)
    );
  }
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
}

async function setError(error: string) {
  gameState.errormessage = error;
}

export function useGameStore() {
  return {
    gameState,
    setGameState,
    updateGameData,
    updatePlayerData,
    setPlayerData,
    setLobbyKey,
    setError,
  };
}
