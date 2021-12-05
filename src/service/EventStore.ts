import { reactive, readonly } from "@vue/reactivity";
import { Client } from "@stomp/stompjs";
import { useLabyrinthStore } from "./LabyrinthStore";
import { EventMessage, Operation } from "./EventMessage";

const { labyrinthState, updateLabyrinth } = useLabyrinthStore();

const wsurl = "ws://localhost:9090/messagebroker";
const DEST = "/event/respond";

const stompclient = new Client({ brokerURL: wsurl });

/**
 * Connection Error Feedback for the Stompclient
 */
stompclient.onWebSocketError = (/*event*/) => {
  console.log("websocketerror");
  labyrinthState.errormessage = "WS-Fehler";
};
stompclient.onStompError = (/*frame*/) => {
  console.log("Stomperror");
  labyrinthState.errormessage = "STOMP-Fehler";
};

/**
 * Stompclient Methode to subscribe the Backend Messages on successful Connection and work with it
 */
stompclient.onConnect = (/*frame*/) => {
  console.log("stomp verbindet");

  stompclient.subscribe(DEST, (message) => {
    console.log("Message ist angekommen");

    console.log(JSON.parse(message.body));

    const EventMessage: EventMessage = JSON.parse(message.body);

    switch (EventMessage.operation) {
      case Operation.MOVEMENT:
        /**
         * @todo: use it when gameState exists and new FE structure is finished
         */
        /*const movePlayer =  gameState.playerMap.get(EventMessage.username);
                const startTileID: number = movePlayer.getPosition();
                const destTileID = gameState.labyrinth.tileMap.get(startTileID).getTileRelationMap.get(eventMessage.data);
                if(destTileID) {
                    movePlayer.setPosition(destTileID);
                }*/

        // -> now UpdateManager (which should be watching after new FE structure is finished) should see a change in gameState
        //    and should move the right Player to the corresponding Tile (in the 3D-Room)

        break;
      case Operation.CLICK:
        break;
      case Operation.CHAT:
        break;
      case Operation.TRADE:
        break;
      default:
        break;
    }

    console.log(EventMessage.operation);
  });
};

/**
 * Methode to handle the Disconnection
 */
stompclient.onDisconnect = () => {
  /* Verbindung abgebaut*/
};

stompclient.activate();
