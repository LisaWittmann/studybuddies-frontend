export interface EventMessage {
  operation: Operation;
  lobbykey: string;
  username: string;
  data: string;
}

export enum Operation {
  MOVEMENT,
  CLICK,
  TRADE,
  CHAT,
}
