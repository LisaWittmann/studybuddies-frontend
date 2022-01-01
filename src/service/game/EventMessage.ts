/**
 * EventMessage: independant class to recieve the EventMessage from the messagebroker as independent Object
 * @param operation: to clarify which Operation Object can be used and which process can be started
 * @param lobbykey: to clarify the lobby for the Backend
 * @param username: to clarify which user sends a respond to the BE or with which user an operation is to be made when the messagebroker calls
 * @param data: for each Operation to be made, there is different data to give more specific informations
 * 
 */
export class EventMessage {
  operation: string;
  lobbyKey: string;
  username: string;
  data: string;

  constructor(operation: string, lobbyKey: string, username: string, data: string) {
    this.operation = operation;
    this.lobbyKey = lobbyKey;
    this.username = username;
    this.data = data;
  }
}

export enum Operation {
  MOVEMENT,
  CLICK,
  TRADE,
  CHAT,
  ROLE_PICK,
}
