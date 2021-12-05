import { reactive, readonly } from "@vue/reactivity";
import { Client } from "@stomp/stompjs";
import { useLabyrinthStore } from "./LabyrinthStore";
import { EventMessage, Operation } from "./EventMessage";
import { useGameStore } from "./GameStore";
import { Player } from "./Player";
import { Orientation } from "./Tile";

const { gameState, updateGame, updatePlayer } = useGameStore();

const wsurl = "ws://localhost:9090/messagebroker";
const DEST = "/event/respond";

const stompclient = new Client({ brokerURL: wsurl });

/**
 * Connection Error Feedback for the Stompclient
 */
stompclient.onWebSocketError = (/*event*/) => {
  console.log("websocketerror");
  gameState.errormessage = "WS-Fehler";
};
stompclient.onStompError = (/*frame*/) => {
  console.log("Stomperror");
  gameState.errormessage = "STOMP-Fehler";
};

/**
 * Stompclient Methode to subscribe the Backend Messages on successful Connection and work with it
 */
stompclient.onConnect = (/*frame*/) => {
  console.log("stomp verbindet");

  stompclient.subscribe(DEST, (message) => {
    console.log("Message ist angekommen");

    console.log(JSON.parse(message.body));

    const eventMessage: EventMessage = JSON.parse(message.body);

    /**
     * Checks whether the user exists in the Game
     */
    const movePlayer: Player | undefined = gameState.playerMap.get(
      eventMessage.username
    );
    switch (eventMessage.operation) {
      case "MOVEMENT":
        if (movePlayer != undefined) {

          const destTileID: number = Number.parseInt(eventMessage.data);

          if (destTileID) {
            movePlayer.setPosition(destTileID);
            updatePlayer(movePlayer);
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
