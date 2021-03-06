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

  constructor(username: string, role: Role | undefined) {
    this.username = username;
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

  setInventory(inventory: Array<Item>): void {
    this.inventory = inventory;
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
