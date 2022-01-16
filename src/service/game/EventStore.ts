import { Client } from "@stomp/stompjs";
import { EventMessage, Operation, Update } from "@/service/game/EventMessage";
import { useGameStore } from "@/service/game/GameStore";
import { useLobbyService } from "@/service/LobbyService";
import router from "@/router";
import { User } from "@/service/login/User";

const { gameState, updatePlayerData, setError } = useGameStore();
const {
  updateUsers,
  setupGame,
  setLabyrinthSelection,
  updateLabyrinths,
  getRoleOptions,
  setUserReadyState,
  setUserFinishedState,
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
      let updateData: Update;
      const operation: Operation = (<any>Operation)[eventMessage.operation];

      switch (operation) {
        case Operation.MOVEMENT:
          destTileID = Number.parseInt(eventMessage.data);

          if (destTileID) {
            updatePlayerData(eventMessage.username, destTileID);
            // -> now the watcher can update the 3D Room
            // and the player should move the right Player to the corresponding Tile (in the 3D-Room)
          } else {
            setError("There is no tile reference for this definition of data");
          }

          break;
        case Operation.CLICK:
          break;
        case Operation.CHAT:
          break;
        case Operation.TRADE:
          break;
        case Operation.READY:
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
        case Operation.CHECK_END:
          lobbyState.users.forEach((user) => {
            if (user.username == eventMessage.data) {
              setUserFinishedState(user.username, true);
            }
          });

          // If both users are finished, redirect to endscreen
          if (lobbyState.users.every((user: User) => user.finished)) {
            router.push("/end");
          }
          break;
        case Operation.LABYRINTH_PICK:
          console.log(Number(eventMessage.data));
          setLabyrinthSelection(Number(eventMessage.data));
          break;
        case Operation.UPDATE:
          updateData = (<any>Update)[eventMessage.data];
          switch (updateData) {
            case Update.LABYRINTHS:
              updateLabyrinths();
              break;
            case Update.USERS:
              updateUsers(eventMessage.lobbyKey);
              break;
            case Update.ROLE:
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
