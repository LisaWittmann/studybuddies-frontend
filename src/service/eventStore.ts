import { Client } from '@stomp/stompjs';
import { useLabyrinthStore } from './LabyrinthStore';
import { eventMessage } from './eventMessage';

const {labyrinthState, updateLabyrinth} = useLabyrinthStore();

const wsurl = "ws:localhost:9090/messagebroker";
const DEST = "/event/respond";

const stompclient = new Client({ brokerURL: wsurl })
stompclient.onWebSocketError = (/*event*/) => { labyrinthState.errormessage = "WS-Fehler" }
stompclient.onStompError = (/*frame*/) => { labyrinthState.errormessage = "STOMP-Fehler" }


stompclient.onConnect = (/*frame*/) => {

    stompclient.subscribe( DEST, (message) => {

        console.log(JSON.parse(message.body));

        const eventMessage: eventMessage = JSON.parse(message.body)

        console.log(eventMessage.operation);


    });
};
stompclient.onDisconnect = () => { /* Verbindung abgebaut*/ }

stompclient.activate();