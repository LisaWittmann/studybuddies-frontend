import { reactive, readonly } from "vue";
import { MainPlayer, Player } from "@/service/game/Player";
import { useLabyrinthStore } from "@/service/labyrinth/LabyrinthStore";
import { useLoginStore } from "@/service/login/LoginStore";

const { labyrinthState, updateLabyrinth } = useLabyrinthStore();

/**
 * PlayerMap: To hold both Players
 * PlayerMap key: Username of the Users
 * Errormessage: To display all kind of Errors in the according scene
 */
const gameState = reactive({
  labyrinthId: 1,
  labyrinth: labyrinthState,
  playerMap: new Map<string, Player>(),
  errormessage: "",
  score: 0,
});

async function updateGame() {
  const { loginState } = useLoginStore();
  gameState.playerMap.set(
    loginState.username,
    new MainPlayer(
      loginState.username,
      true,
      gameState.labyrinth.playerStartTileIds[0]
    )
  );
  updateLabyrinth(gameState.labyrinthId);
}

function setLabyrinth(labyrinthId: number) {
  gameState.labyrinthId = labyrinthId;
  updateLabyrinth(gameState.labyrinthId);
  console.log(gameState);
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
    setLabyrinth,
  };
}
