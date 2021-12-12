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
  updateLabyrinthData(gameState.lobbyKey);
}

/**
 * Updates the Player so, the watcher can build the changes
 * @param player: the new (changed) player object
 */
async function updatePlayer(player: Player) {
  gameState.playerMap.set(player.username, player);
}


async function setPlayer(username: string, startTileId: number) {
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
