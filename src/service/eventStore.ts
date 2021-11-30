import { reactive, readonly } from '@vue/reactivity';
import { Client } from '@stomp/stompjs';
import { useLabyrinthStore } from './LabyrinthStore';
import { eventMessage } from './eventMessage';

const {labyrinthState, updateLabyrinth} = useLabyrinthStore();

//const wsurl = "ws://localhost:9090/messagebroker";
const DEST = "/event/respond";

const stompclient = new Client({/* brokerURL: wsurl */});

/**
 * Connection Error Feedback for the Stompclient
 */
stompclient.onWebSocketError = (/*event*/) => { console.log("websocketerror"); labyrinthState.errormessage = "WS-Fehler" }
stompclient.onStompError = (/*frame*/) => { console.log("Stomperror"); labyrinthState.errormessage = "STOMP-Fehler" }

/**
 * Stompclient Methode to subscribe the Backend Messages on successful Connection and work with it
 */
stompclient.onConnect = (/*frame*/) => {

    console.log("stomp verbindet");

    stompclient.subscribe( DEST, (message) => {

        console.log("Message ist angekommen");

        console.log(JSON.parse(message.body));

        const eventMessage: eventMessage = JSON.parse(message.body)

        console.log(eventMessage.operation);


    });
};

/**
 * Methode to handle the Disconnection
 */
stompclient.onDisconnect = () => { /* Verbindung abgebaut*/ }


stompclient.activate();