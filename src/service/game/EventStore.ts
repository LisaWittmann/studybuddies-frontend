import { Client } from "@stomp/stompjs";
import { EventMessage, Operation, Update } from "@/service/game/EventMessage";

import { useAppService } from "@/service/AppService";
import { useGameStore } from "@/service/game/GameStore";
import { useGameService } from "@/service/game/GameService";
import { useLobbyService } from "@/service/lobby/LobbyService";

import router from "@/router";

const { setFeedback } = useAppService();
const { updateInventory, endGame } = useGameService();
const { gameState, updatePlayerData, updateGameData, setError, setScore } =
  useGameStore();
const {
  updateUsers,
  setupGame,
  setLabyrinthSelection,
  updateLabyrinths,
  getRoleOptions,
  setUserReadyState,
  setUserFinishState,
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

      let destTileKey: number;
      let updateData: Update;
      const operation = (<any>Operation)[eventMessage.operation];

      switch (operation) {
        case Operation.MOVEMENT:
          destTileKey = Number.parseInt(eventMessage.data);
          if (destTileKey) {
            updatePlayerData(eventMessage.username, destTileKey);
          } else {
            setError("There is no tile reference for this definition of data");
          }
          break;
        case Operation.COLLECT:
          updateGameData();
          break;
        case Operation.TRADE:
          updateInventory();
          break;
        case Operation.ACCESS:
          setScore(Number(eventMessage.data));
          break;
        case Operation.READY:
          if (
            eventMessage.username === "ALL_OF_LOBBY" &&
            eventMessage.data === "READY"
          ) {
            setupGame();
          } else {
            setUserReadyState(
              eventMessage.data === "READY",
              eventMessage.username
            );
          }
          break;
        case Operation.CHECK_END:
          lobbyState.users.forEach((user) => {
            if (user.username == eventMessage.data) {
              setUserFinishState(user.username, true);
            }
          });

          // If both users are finished, redirect to endscreen
          if (lobbyState.users.every((user) => user.finished)) {
            endGame();
            router.push(`/end/${gameState.lobbyKey}`);
          }
          break;
        case Operation.LABYRINTH_PICK:
          setLabyrinthSelection(eventMessage.data);
          break;
        case Operation.UPDATE:
          updateData = (<any>Update)[eventMessage.data];
          switch (updateData) {
            case Update.LABYRINTHS:
              updateLabyrinths();
              break;
            case Update.USERS:
              updateUsers();
              if (gameState.started) {
                setFeedback(
                  `Spieler ${eventMessage.username} hat das Spiel verlassen.`,
                  undefined,
                  "/find",
                  "Zurück zur Lobbyfindung"
                );
              }
              break;
            case Update.ROLE:
              getRoleOptions();
              break;
          }
          break;
      }
    }
  });
};

stompClient.activate();
