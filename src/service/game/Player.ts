import { Item } from "@/service/labyrinth/Item";

/**
 * enumeration of role of player,
 * defines player appearance in game
 */
export enum Role {
  DESIGNER,
  HACKER,
}

/**
 * interface player that defines required variables
 * and functions of all player implementation
 */
export interface Player {
  username: string;
  position: number;
  role: Role | undefined;

  getUsername(): string;
  getPosition(): number;
  getRole(): Role | undefined;
  setPosition(position: number): void;
}

/**
 * implementation of player interfaces
 * for main player in game (current loggedIn user)
 * that is represented as camera in scene
 * extends player by an inventory
 */
export class MainPlayer implements Player {
  username: string;
  position!: number;
  role: Role | undefined;
  inventory: Item[];
  /*dummydata for development
    -> wait for Task #100 to be finished
  */
  /* inventory: Item[] = [
    new Item(1, "usb", "EAST", ["NORTH", "WEST"], new Vector3(0, 0, 0)),
    new Item(2, "mouse", "EAST", ["NORTH", "WEST"], new Vector3(0, 0, 0)),
    new Item(3, "keyboard", "EAST", ["NORTH", "WEST"], new Vector3(0, 0, 0)),
    new Item(4, "vr-glasses", "EAST", ["NORTH", "WEST"], new Vector3(0, 0, 0)),
    new Item(5, "cap", "EAST", ["NORTH", "WEST"], new Vector3(0, 0, 0)),
    new Item(6, "tablet", "EAST", ["NORTH", "WEST"], new Vector3(0, 0, 0)),
    new Item(7, "touchpen", "EAST", ["NORTH", "WEST"], new Vector3(0, 0, 0)),
    new Item(8, "mug", "EAST", ["NORTH", "WEST"], new Vector3(0, 0, 0)),
    new Item(9, "mug", "EAST", ["NORTH", "WEST"], new Vector3(0, 0, 0)),
    new Item(10, "mug", "EAST", ["NORTH", "WEST"], new Vector3(0, 0, 0)),
    new Item(11, "mug", "EAST", ["NORTH", "WEST"], new Vector3(0, 0, 0)),
  ]; */

  constructor(username: string, role: Role | undefined) {
    this.username = username;
    //this.position = playerPosition;
    this.role = role;
    this.inventory = new Array<Item>();
  }

  /**
   * add new Item to inventory, sets item id as key
   * @param item: item that should be added to players inventory
   */
  addItem(item: Item): void {
    this.inventory.push(item);
  }

  getUsername(): string {
    return this.username;
  }

  getPosition(): number {
    return this.position;
  }

  getRole(): Role | undefined {
    return this.role;
  }

  getInventory(): Array<Item> {
    return this.inventory;
  }

  setPosition(position: number): void {
    this.position = position;
  }

  setInventory(invenory: Array<Item>) {
    this.inventory = invenory;
  }
}

/**
 * implementation of interface player
 * for partner player that is represented as object in scene
 */
export class PartnerPlayer implements Player {
  username: string;
  position!: number;
  role: Role | undefined;

  constructor(username: string, role: Role | undefined) {
    this.username = username;
    this.role = role;
  }

  getUsername(): string {
    return this.username;
  }

  getPosition(): number {
    return this.position;
  }

  getRole(): Role | undefined {
    return this.role;
  }

  setPosition(position: number): void {
    this.position = position;
  }
}
