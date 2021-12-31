/**
 * EventMessage: independent interface to receiving the EventMessage Object from the MessageBroker as independent Object
 * @param operation: to clarify which Operation Object can be used and which process can be started
 * @param lobbyKey: to clarify the lobby for the Backend
 * @param username: to clarify which user sends a request to the BE and for which user an operation is to be made when the MessageBroker calls
 * @param data: for each Operation to be made, there is different data
 */
export interface EventMessage {
  operation: string;
  lobbyKey: string;
  username: string;
  data: string;
}

export enum Operation {
  MOVEMENT,
  CLICK,
  TRADE,
  CHAT,
  ROLE_PICK,
}

/**
 * MoveOperation: Respond object to be used for specifying the EventMessage Object from the MessageBroker
 * @param data: { "NORTH", "EAST", "SOUTH", "WEST" } to send
 * @param data: { "0"    , "1"   , "2"    , "3" } to receive
 */
export class MoveOperation implements EventMessage {
  operation = "MOVEMENT";
  lobbyKey: string;
  username: string;
  data: string;

  constructor(lobbyKey: string, username: string, data: string) {
    this.lobbyKey = lobbyKey;
    this.username = username;
    this.data = data;
  }
}

/**
 * MoveOperation: Respond object to be used for specifying the EventMessage Object from the MessageBroker
 * 
 */
 export class PickOperation implements EventMessage {
  operation = "LABYRINTH_PICK";
  lobbyKey: string;
  username: string;
  data: string;

  constructor(lobbyKey: string, username: string, data: string) {
    this.lobbyKey = lobbyKey;
    this.username = username;
    this.data = data;
  }
}
