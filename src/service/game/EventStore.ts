import { Client } from "@stomp/stompjs";
import { EventMessage } from "@/service/game/EventMessage";
import { useGameStore } from "@/service/game/GameStore";
import { useLobbyService } from "@/service/LobbyService";
import router from "@/router";
import { ref } from "vue";
import { useLabyrinthStore } from "../labyrinth/LabyrinthStore";
import { VectorKeyframeTrack } from "three";
import { Item } from "../labyrinth/Item";

const {
  gameState,
  updatePlayerData,
  updatePlayerInventory,
  setError,
  setPlayerData,
  updateGameData,
} = useGameStore();
const {
  updateUsers,
  setupGame,
  setLabyrinthSelection,
  updateLabyrinths,
  getRoleOptions,
  setUserReadyState,
  lobbyState,
} = useLobbyService();

let wsURL = "ws://localhost:9090/messagebroker";
const DEST = "/event/respond";

// websocket url for production
if (location.protocol.startsWith("https")) {
  wsURL = `wss://${location.host}/messagebroker`;
}

const stompClient = new Client({ brokerURL: wsURL });

/**
 * Connection Error Feedback for the StompClient
 */
stompClient.onWebSocketError = () => {
  console.log("websocketerror");
  setError("WS-Fehler");
};
stompClient.onStompError = () => {
  console.log("Stomperror");
  setError("STOMP-Fehler");
};

/**
 * StompClient Methode to subscribe the Backend Messages on successful Connection and work with it
 */
stompClient.onConnect = () => {
  console.log("stomp verbindet");

  stompClient.subscribe(DEST, (message) => {
    const eventMessage: EventMessage = JSON.parse(message.body);

    if (
      eventMessage.lobbyKey == gameState.lobbyKey ||
      eventMessage.lobbyKey == "ALL"
    ) {
      console.log("new Message for the Lobby");

      let destTileID: number;

      switch (eventMessage.operation) {
        case "MOVEMENT":
          destTileID = Number.parseInt(eventMessage.data);

          if (destTileID) {
            updatePlayerData(eventMessage.username, destTileID);
            // -> now the watcher can update the 3D Room
            // and the player should move the right Player to the corresponding Tile (in the 3D-Room)
          } else {
            setError("There is no tile reference for this definition of data");
          }

          break;
        case "CLICK":
          // Item needs to disappear
          updateLabyrinths();
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
 * Method to handle the Disconnection
 */
stompClient.onDisconnect = () => {
  //Connection closed
};

stompClient.activate();
