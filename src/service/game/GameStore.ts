import { reactive, readonly, computed } from "vue";
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
  //playerMap: new Map<string, Player>(),
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
    const jsonObj: any = JSON.parse(mainPlayer);
    //Vllt hier, weils nicht mehr das gleiche Objekt ist?
    const mP: MainPlayer = Object.assign(new MainPlayer("", 0), jsonObj);
    gameState.mainPlayer = mP;
    console.log("MP:" + mP.constructor.name);
    //gameState.playerMap.set(mP.getUsername(), mP);
  }
  if (partnerPlayer) {
    const jsonObj: any = JSON.parse(partnerPlayer);
    const pP: PartnerPlayer = Object.assign(new PartnerPlayer("", 0), jsonObj);
    gameState.partnerPlayer = pP;
    //gameState.playerMap.set(pP.getUsername(), pP);
  }
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
  //const foundPlayer = gameState.playerMap.get(player.getUsername());
  //let foundPlayer;
  if (player.getUsername() == gameState.mainPlayer.getUsername()) {
    gameState.mainPlayer.setPosition(newPosition);
  } else {
    gameState.partnerPlayer.setPosition(newPosition);
  }
  //console.log("FOUND PLAYER " + foundPlayer);
  /*   if (foundPlayer) {
    foundPlayer.setPosition(newPosition);
    gameState.playerMap.set(player.username, player);
  } */
}

/**
 * sets a Player with its username and the startTileId
 * @param username : name of the user in the playerMap to improve identification between Main- and Partnerplayer
 * @param startTileId : start position of the player at the start of the game
 */
async function setPlayerData(username: string, startTileId: number) {
  console.log("Starttileid is: " + startTileId + " Playername is: " + username);
  const { loginState } = useLoginStore();
  if (loginState.username == username) {
    gameState.mainPlayer = new MainPlayer(username, startTileId);
    //gameState.playerMap.set(username, computed(()=>gameState.mainPlayer));
  } else {
    gameState.partnerPlayer = new PartnerPlayer(username, startTileId);
    //gameState.playerMap.set(username, gameState.partnerPlayer);
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
