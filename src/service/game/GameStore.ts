import { reactive, readonly } from "vue";
import { MainPlayer, PartnerPlayer, Player, Role } from "@/service/game/Player";
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

function updateGameData() {
  return updateLabyrinthData(gameState.lobbyKey);
}

/**
 * Updates the Player so, the watcher can build the changes
 * @param player: the new (changed) player object
 * @param newPosition: new position of the player
 */
function updatePlayerData(username: string, newPosition: number) {
  const foundPlayer = gameState.playerMap.get(username);
  if (foundPlayer) {
    foundPlayer.setPosition(newPosition);
    gameState.playerMap.set(foundPlayer.username, foundPlayer);
  } else {
    setError("No Player found with Name: " + username);
  }
}

/**
 * sets a Player with its username and the startTileId
 * @param username: name of the user in the playerMap to improve identification between Main- and PartnerPlayer
 * @param role: role of the given user
 * @param startTileId: start position of the player at the start of the game
 */
async function setPlayerData(username: string, role: Role) {
  const { loginState } = useLoginStore();
  if (loginState.username == username) {
    gameState.playerMap.set(username, new MainPlayer(username, role));
  } else {
    gameState.playerMap.set(username, new PartnerPlayer(username, role));
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
    updateGameData,
    updatePlayerData,
    setPlayerData,
    setLobbyKey,
    setError,
  };
}
