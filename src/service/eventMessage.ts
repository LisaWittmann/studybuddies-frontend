
export interface eventMessage {
    operation: Operation,
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
    username: string;
    data: string;

    constructor (operation: Operation, username: string, data: string) {
        this.operation = operation;
        this.username = username;
        this.data = data;
    }
}