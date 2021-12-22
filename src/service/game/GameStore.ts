import { reactive, readonly } from "vue";
import { MainPlayer, PartnerPlayer, Player } from "@/service/game/Player";
import { useLabyrinthStore } from "@/service/labyrinth/LabyrinthStore";
import { useLoginStore } from "@/service/login/LoginStore";
import { Labyrinth } from "@/service/labyrinth/Labyrinth";

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

function setGameState(
  lobbyKey: string | null,
  labyrinthId: string | null,
  labyrinth: string | null,
  playerMap: string | null,
  errormessage: string | null,
  score: string | null
) {
  if (lobbyKey) gameState.lobbyKey = lobbyKey;
  if (labyrinthId) gameState.labyrinthId = JSON.parse(labyrinthId) as number;
  if (labyrinth) gameState.labyrinth = JSON.parse(labyrinth) as Labyrinth;
  if (playerMap)
    gameState.playerMap = JSON.parse(playerMap) as Map<string, Player>;
  if (errormessage) gameState.errormessage = errormessage;
  if (score) gameState.score = JSON.parse(score) as number;
}

async function updateGameData() {
  await updateLabyrinthData(gameState.lobbyKey);
}

/**
 * Updates the Player so, the watcher can build the changes
 * @param player: the new (changed) player object
 * @param newPosition: setzt die neue Position des Spielers
 */
function updatePlayerData(player: Player, newPosition: number) {
  const foundPlayer = gameState.playerMap.get(player.getUsername());
  if (foundPlayer) {
    foundPlayer.setPosition(newPosition);
    gameState.playerMap.set(player.username, player);
  }
}

/**
 * sets a Player with its username and the startTileId
 * @param username : name of the user in the playerMap to improve identification between Main- and Partnerplayer
 * @param startTileId : start position of the player at the start of the game
 */
async function setPlayerData(username: string, startTileId: number) {
  console.log("Starttileid is: " + startTileId);
  const { loginState } = useLoginStore();
  if (loginState.username == username) {
    gameState.playerMap.set(username, new MainPlayer(username, startTileId));
  } else {
    gameState.playerMap.set(username, new PartnerPlayer(username, startTileId));
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
    setGameState,
    updateGameData,
    updatePlayerData,
    setPlayerData,
    setLobbyKey,
    setError,
  };
}
