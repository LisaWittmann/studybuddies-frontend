import { reactive, readonly } from "vue";
import { MainPlayer, PartnerPlayer, Player } from "@/service/game/Player";
import { useLabyrinthStore } from "@/service/labyrinth/LabyrinthStore";
import { useLoginStore } from "@/service/login/LoginStore";

const { labyrinthState, updateLabyrinthData } = useLabyrinthStore();

/**
 * PlayerMap: To hold both Players
 * PlayerMap key: Username of the Users
 * Errormessage: To display all kind of Errors in the according scene
 */
const gameState = reactive({
  lobbyKey: "",
  labyrinthId: 1,
  labyrinth: labyrinthState,
  playerMap: new Map<string, Player>(),
  errormessage: "",
  score: 0,
});

async function updateGame() {
  await updateLabyrinthData(gameState.lobbyKey);
}

/**
 * Updates the Player so, the watcher can build the changes
 * @param player: the new (changed) player object
 * @param newPosition: setzt die neue Position des Spielers
 */
function updatePlayer(player: Player, newPosition: number) {
  const foundPlayer = gameState.playerMap.get(player.getUsername());
  if (foundPlayer) {
    foundPlayer.setPosition(newPosition);
    gameState.playerMap.set(player.username, player);
  }
}

/**
 * sets a Player with its username and the startTileId
 * @param username : used to set as key in the playerMap make Identification between Main and Partnerplayer better
 * @param startTileId : used to place the Player where they belong in the frontend
 */
function setPlayer(username: string, startTileId: number) {
  
  console.log("Starttileid is: " + startTileId)
  const { loginState } = useLoginStore();
  if (loginState.username == username) {
    gameState.playerMap.set(username, new MainPlayer(username, true, startTileId));
  } else {
    gameState.playerMap.set(username, new PartnerPlayer(username, false, startTileId));
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
    gameState: readonly(gameState),
    updateGame,
    updatePlayer,
    setPlayer,
    setLobbyKey,
    setError,
  };
}
