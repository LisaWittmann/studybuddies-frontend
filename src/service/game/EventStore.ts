import { Client } from "@stomp/stompjs";
import { Player } from "@/service/game/Player";
import { EventMessage } from "@/service/game/EventMessage";
import { useGameStore } from "@/service/game/GameStore";
import router from "@/router";

const { gameState, updatePlayer } = useGameStore();

const wsurl = "ws://localhost:9090/messagebroker";
const DEST = "/event/respond";

const stompclient = new Client({ brokerURL: wsurl });

/**
 * Connection Error Feedback for the Stompclient
 */
stompclient.onWebSocketError = () => {
  console.log("websocketerror");
  gameState.errormessage = "WS-Fehler";
};
stompclient.onStompError = () => {
  console.log("Stomperror");
  gameState.errormessage = "STOMP-Fehler";
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
            gameState.errormessage =
              "There is no Tilereference for this definition of data";
          }
        } else {
          gameState.errormessage = "No existing User";
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
          fetch(`api/lobby/${gameState.lobbyKey}/id`, {
            method: "GET"
          }).then((response) => {
            return response.json();
          }).then((json) => {
            gameState.labyrinthId = json;
            console.log("Labyrinth id for this lobby is: " + gameState.labyrinthId);
          })
          router.push(`/game/${gameState.lobbyKey}`);
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
