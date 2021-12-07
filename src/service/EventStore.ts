import { Client } from "@stomp/stompjs";
import { useLabyrinthStore } from "@/service/LabyrinthStore";
import { EventMessage, Operation } from "@/service/EventMessage";

const { labyrinthState } = useLabyrinthStore();

const wsurl = "ws://localhost:9090/messagebroker";
const DEST = "/event/respond";

const stompclient = new Client({ brokerURL: wsurl });

/**
 * Connection Error Feedback for the Stompclient
 */
stompclient.onWebSocketError = () => {
  console.log("websocketerror");
  labyrinthState.errormessage = "WS-Fehler";
};
stompclient.onStompError = () => {
  console.log("Stomperror");
  labyrinthState.errormessage = "STOMP-Fehler";
};

/**
 * Stompclient Methode to subscribe the Backend Messages on successful Connection and work with it
 */
stompclient.onConnect = () => {
  console.log("stomp verbindet");

  stompclient.subscribe(DEST, (message) => {
    console.log("Message ist angekommen");

    console.log(JSON.parse(message.body));

    const EventMessage: EventMessage = JSON.parse(message.body);

    switch (EventMessage.operation) {
      case Operation.MOVEMENT:
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
  console.log("disconnected");
};

stompclient.activate();
