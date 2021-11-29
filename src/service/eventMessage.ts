
export interface eventMessage {
    operation: Enumerator,
    lobbykey: string,
    username: string,
    data: string
}

export enum Operation {
    MOVEMENT,
    CLICK
}