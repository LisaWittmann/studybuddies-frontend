import {reactive, readonly} from "vue";
import {MainPlayer, Player} from "@/service/game/Player";
import {useLabyrinthStore} from "@/service/labyrinth/LabyrinthStore";
import {useLoginStore} from "@/service/login/LoginStore";

const {labyrinthState, updateLabyrinth} = useLabyrinthStore();
updateLabyrinth();

const {loginState} = useLoginStore();
/**
 * PlayerMap: To hold both Players
 * PlayerMap key: Username of the Users
 * Errormessage: To display all kind of Errors in the according scene
 */
const gameState = reactive({
    labyrinth: labyrinthState,
    playerMap: new Map<string, Player>(),
    errormessage: "",
    score: 0,
});

gameState.playerMap.set(
    loginState.username,
    new MainPlayer(loginState.username, true, gameState.labyrinth.playerStartTileIds[0])
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
