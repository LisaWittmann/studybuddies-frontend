/**
 * EventMessage: independant interface to recieving the EventMessage Object from the messagebroker as independent Object
 * @param operation: to clarify which Operation Object can be used and which process can be started
 * @param lobbykey: to clarify the lobby for the Backend
 * @param username: to clarify which user sends an respond to the BE and for which user an operation is to be made when the messagebroker calls
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
}

/**
 * MoveOperation: Respond object to be used for specifiying the EventMessage Object from the messagebroker
 * @param data: { "NORTH", "EAST", "SOUTH", "WEST" } to send
 * @param data: { "0"    , "1"   , "2"    , "3" } to recieve
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
