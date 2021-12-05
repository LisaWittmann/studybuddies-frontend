import { reactive, readonly } from '@vue/reactivity';
import { Client } from '@stomp/stompjs';
import { useLabyrinthStore } from './LabyrinthStore';
import { EventMessage, Operation } from './EventMessage';
import { useGameStore } from './GameStore';
import { Player } from './Player';
import { Orientation } from './Tile';

const {gameState, updateGame, updatePlayer} = useGameStore();

const wsurl = "ws://localhost:9090/messagebroker";
const DEST = "/event/respond";

const stompclient = new Client({ brokerURL: wsurl });

/**
 * Connection Error Feedback for the Stompclient
 */
stompclient.onWebSocketError = (/*event*/) => { console.log("websocketerror"); gameState.errormessage = "WS-Fehler" }
stompclient.onStompError = (/*frame*/) => { console.log("Stomperror"); gameState.errormessage = "STOMP-Fehler" }

/**
 * Stompclient Methode to subscribe the Backend Messages on successful Connection and work with it
 */
stompclient.onConnect = (/*frame*/) => {

    console.log("stomp verbindet");

    stompclient.subscribe( DEST, (message) => {

        console.log("Message ist angekommen");

        console.log(JSON.parse(message.body));

        const eventMessage: EventMessage = JSON.parse(message.body)

        switch(eventMessage.operation) {
            case Operation.MOVEMENT:

                /**
                 * Checks whether the user exists in the Game
                 */
                const movePlayer = gameState.playerMap.get(eventMessage.username);
                if(movePlayer != undefined) {


                    /**
                     * Switch case to let the eventMessage data be flexibel as String, so it can be used with other Operations too
                     */
                    let orientation: Orientation|undefined;
                    switch(eventMessage.data){

                        case "NORTH":
                            orientation = Orientation.NORTH;
                            break;
                        case "EAST":
                            orientation = Orientation.NORTH;
                            break;
                        case "SOUTH":
                            orientation = Orientation.NORTH;
                            break;
                        case "WEST":
                            orientation = Orientation.NORTH;
                            break;
                        default:
                            orientation = undefined;
                            break;
                    }

                    if(orientation != undefined) {
                        const startTileID: number = movePlayer.getPosition();
                        const destTileID = gameState.labyrinth.tileMap.get(startTileID)?.getTileRelationMap().get(orientation);
                        
                        if(destTileID) {
                            movePlayer.setPosition(destTileID);
                            updatePlayer(movePlayer);
                        } else {
                            gameState.errormessage = "There is no Tilereference for this definition of data";
                        }

                    }else {
                        gameState.errormessage = "Wrong data set";
                    }

                } else {
                    gameState.errormessage = "No existing User";
                }
                

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

        console.log(eventMessage.operation);

    });
};

/**
 * Methode to handle the Disconnection
 */
stompclient.onDisconnect = () => { /* Verbindung abgebaut*/ }


stompclient.activate();
