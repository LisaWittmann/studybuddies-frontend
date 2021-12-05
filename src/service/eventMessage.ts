
export interface eventMessage {
    operation: Operation,
    lobbykey: string,
    username: string,
    data: string
}

export enum Operation {
    MOVEMENT,
    CLICK,
    TRADE,
    CHAT
}

export class MoveOperation implements eventMessage {
    operation: Operation;
    lobbykey: string;
    username: string;
    data: string;

    constructor (operation: Operation, lobbykey: string, username: string, data: string) {
        this.operation = operation;
        this.lobbykey = lobbykey;
        this.username = username;
        this.data = data;
    }
    
}