import { Client } from "@stomp/stompjs";
import { Player } from "@/service/game/Player";
import { EventMessage } from "@/service/game/EventMessage";
import { useGameStore } from "@/service/game/GameStore";
import { useLoginStore } from "../login/LoginStore";
import { useLobbyService } from "@/service/LobbyService";
import router from "@/router";
import { computed, ref } from "vue";

const { gameState, updatePlayerData, setError, setPlayerData, updateGameData } =
  useGameStore();
const { updateUsers, lobbyState } = useLobbyService();

const wsurl = "ws://localhost:9090/messagebroker";
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
    console.log("Message ist angekommen");

    const eventMessage: EventMessage = JSON.parse(message.body);

    /**
     * Checks whether the user exists in the Game
     */
    const playerToMove: Player | undefined = gameState.playerMap.get(
      eventMessage.username
    );
    console.log(eventMessage);
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
        if (eventMessage.data === "READY") {
          // NUR TEMPORÄR (Bis nach dem MessageBroker Ticket)
          // Bitte noch nicht sofort ändern!
          // @todo: Ändern!
          const { loginState } = useLoginStore();

          updateGameData().then(() => {
            updateUsers(gameState.lobbyKey);
            //let index = 0;
            lobbyState.users.forEach((user, index) => {
              setPlayerData(
                user.username,
                gameState.labyrinth.playerStartTileIds[index]
              );
            });

            router.push(`/game/${gameState.lobbyKey}`);
            console.log("gameState nach ready finish");
            console.log(gameState);
          });
        } else {
          // One player ready
          const { loginState } = useLoginStore();

          updateUsers(gameState.lobbyKey);
          const state = computed(() => lobbyState.users);

          // console.log('loginState 1P ready: ', loginState)
          // console.log('lobbyState 1P ready: ', lobbyState.users)
          console.log("State: ", state.value);
        }
        break;
      case "JOIN":
        updateUsers(eventMessage.lobbyKey);
        break;
      default:
        break;
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
