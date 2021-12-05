import { reactive } from "@vue/runtime-dom";
import { useLabyrinthStore } from "./LabyrinthStore";
import { activePlayer, Player } from "./Player";

const { labyrinthState, updateLabyrinth } = useLabyrinthStore();
updateLabyrinth();

const gameState = reactive({
  /**
   * PlayerMap: To hold both Players
   * PlayerMap key: Username of the Users
   *
   * Errormessage: To display all kind of Errors in the according scene
   */
  labyrinth: labyrinthState,
  playerMap: new Map<string, Player>(),
  errormessage: "",
  score: 0,
});

gameState.playerMap.set(
  "TestUser",
  new activePlayer("TestUser", true, gameState.labyrinth.playerStartTileIds[0])
);

async function updateGame() {
  updateLabyrinth();
}

/**
 * Updates the Player so, the watcher can build the changes
 * @param player: the new (changed) player object
 */
async function updatePlayer(player: Player) {
  gameState.playerMap.set(player.username, player);
}

export function useGameStore() {
  return {
    gameState,
    updateGame,
    updatePlayer,
  };
}
