import { reactive } from "@vue/runtime-dom";
import { useLabyrinthStore } from "./LabyrinthStore";
import { Player } from "./Player";
import { } from "@/service/eventStore"

const { labyrinthState, updateLabyrinth } = useLabyrinthStore();
updateLabyrinth();

const gameState = reactive({

    /**
     * PlayerMap: To hold both Players
     * PlayerMap key: Username of the Users
     * //True -> acitve Player
     * //False -> other Player
     * 
     * Errormessage: To display all kind of Errors in the according scene
     */
    labyrinth: labyrinthState,
    playerMap: new Map<string, Player>(),
    errormessage: "",
    score: 0,

});

async function updateGame() {
    updateLabyrinth();
}

async function updatePlayer(player: Player) {
    gameState.playerMap.set(player.username, player) 
}


export function useGameStore() {
    return {
      gameState,
      updateGame,
      updatePlayer
    };
  }