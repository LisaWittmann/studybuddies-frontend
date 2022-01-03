import { Client } from "@stomp/stompjs";
import { Player } from "@/service/game/Player";
import { EventMessage } from "@/service/game/EventMessage";
import { useGameStore } from "@/service/game/GameStore";
import { useLobbyService } from "@/service/LobbyService";
import router from "@/router";
import { ref } from "vue";

const { gameState, updatePlayerData, setError, setPlayerData, updateGameData } =
  useGameStore();
const {
  updateUsers,
  setupGame,
  setLabyrinthSelection,
  updateLabyrinths,
  getRoleOptions,
  setUserReadyState,
  lobbyState,
} = useLobbyService();

let wsurl = "ws://localhost:9090/messagebroker";

// websocket url for production
if (location.protocol.startsWith("https")) {
  wsurl = `wss://${location.host}/messagebroker`;
}

const DEST = "/event/respond";
const stompclient = new Client({ brokerURL: wsurl });

/**
 * Connection Error Feedback for the Stompclient
 */
stompclient.onWebSocketError = () => {
  console.log("websocketerror");
  setError("WS-Fehler");
};
stompclient.onStompError = () => {
  console.log("Stomperror");
  setError("STOMP-Fehler");
};

/**
 * Stompclient Methode to subscribe the Backend Messages on successful Connection and work with it
 */
stompclient.onConnect = () => {
  console.log("stomp verbindet");

  stompclient.subscribe(DEST, (message) => {
    console.log("Message received");

    const eventMessage: EventMessage = JSON.parse(message.body);

    if (
      eventMessage.lobbyKey == gameState.lobbyKey ||
      eventMessage.lobbyKey == "ALL"
    ) {
      console.log("Message in the right Lobby");

      /**
       * Checks whether the user exists in the Game
       */
      const playerToMove: Player | undefined = gameState.playerMap.get(
        eventMessage.username
      );
      switch (eventMessage.operation) {
        case "MOVEMENT":
          if (playerToMove) {
            const destTileID: number = Number.parseInt(eventMessage.data);

            if (destTileID) {
              updatePlayerData(playerToMove, destTileID);
              // -> now the watcher can update the 3D Room
              // and the player should move the right Player to the corresponding Tile (in the 3D-Room)
            } else {
              setError("There is no Tilereference for this definition of data");
            }
          } else {
            setError("No existing User");
          }

          break;
        case "CLICK":
          break;
        case "CHAT":
          break;
        case "TRADE":
          break;
        case "READY":
          console.log(eventMessage);
          if (
            eventMessage.username === "ALL_OF_LOBBY" &&
            eventMessage.data === "READY"
          ) {
            setupGame();
          } else {
            setUserReadyState(
              eventMessage.username,
              eventMessage.data === "READY"
            );
            console.log(
              lobbyState.users.find(
                (user) => user.username == eventMessage.username
              )
            );
          }
          break;
        case "LABYRINTH_PICK":
          console.log(Number(eventMessage.data));
          setLabyrinthSelection(Number(eventMessage.data));
          break;
        case "UPDATE":
          switch (eventMessage.data) {
            case "LABYRINTHS":
              updateLabyrinths();
              break;
            case "USERS":
              updateUsers(eventMessage.lobbyKey);
              break;
            case "ROLE":
              console.log("RoleOptions holen");
              getRoleOptions(eventMessage.lobbyKey);
              break;
            default:
              console.info(
                "No List was updated with Data: " + eventMessage.data
              );
              break;
          }
          break;
        default:
          console.error(
            eventMessage.operation + " is no valid EventMessage Operation."
          );
          break;
      }
    }
  });
};

/**
 * Methode to handle the Disconnection
 */
stompclient.onDisconnect = () => {
  /* Verbindung abgebaut*/
};

stompclient.activate();
