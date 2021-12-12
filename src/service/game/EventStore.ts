import { Client } from "@stomp/stompjs";
import { Player } from "@/service/game/Player";
import { EventMessage } from "@/service/game/EventMessage";
import { useGameStore } from "@/service/game/GameStore";
import { useLoginStore } from "../login/LoginStore";
import router from "@/router";

const { gameState, updatePlayer, setError, setPlayer } = useGameStore();

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
    console.log(JSON.parse(message.body));

    const eventMessage: EventMessage = JSON.parse(message.body);

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
            playerToMove.setPosition(destTileID);
            console.log(playerToMove.getPosition())
            updatePlayer(playerToMove);
            // -> now the watcher can update the 3D Room
            // and the player should move the right Player to the corresponding Tile (in the 3D-Room)
          } else {
            setError(
              "There is no Tilereference for this definition of data");
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
          setPlayer(loginState.username, gameState.labyrinth.playerStartTileIds[0]);

          router.push(`/game/${gameState.lobbyKey}`);
          console.log("gameState nach ready finish");
          console.log(gameState);
        }
        break;
      default:
        break;
    }

    console.log(eventMessage.operation);
    console.log(gameState);
  });
};

/**
 * Methode to handle the Disconnection
 */
stompclient.onDisconnect = () => {
  /* Verbindung abgebaut*/
};

stompclient.activate();
