import { Item } from "./Item";

export interface Player {

    username: string;
    active: Boolean;
    position: number;

    getUsername(): String;
    getActive(): Boolean;
    getPosition(): number;
    setPosition(position: number): void;
}

export class activePlayer implements Player {
    username: string;
    active: Boolean;
    position: number;
    inventar: Map<number, Item>;

    constructor(username: string, active: Boolean, playerPosition: number) {
        this.username = username;
        this.active = active;
        this.position = playerPosition;

        this.inventar = new Map<number, Item>();
    }

    addItem(item: Item) {
        this.inventar.set(item.id, item);
    }
    
    getUsername(): String {
        return this.username;
    }

    getActive(): Boolean{
        return this.active;
    }

    getPosition(): number{
        return this.position;
    }

    getInventar(): Map<number, Item>{
        return this.inventar;
    }

    setPosition(position: number){
        this.position = position;
    }
}

export class inactivePlayer implements Player {
    username: string;
    active: Boolean;
    position: number;

    constructor(username: string, active: Boolean, playerPosition: number) {
        this.username = username;
        this.active = active;
        this.position = playerPosition;
    }
    
    getUsername(): String {
        return this.username;
    }

    getActive(): Boolean{
        return this.active;
    }

    getPosition(): number{
        return this.position;
    }

    setPosition(position: number){
        this.position = position;
    }
}