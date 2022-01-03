import { Item } from "@/service/labyrinth/Item";

export interface Player {
  username: string;
  active: boolean;
  position: number;

  getUsername(): string;
  getActive(): boolean;
  getPosition(): number;
  setPosition(position: number): void;
}

export class MainPlayer implements Player {
  username: string;
  active: boolean;
  position: number;
  inventory: Map<number, Item>;

  constructor(username: string, active: boolean, playerPosition: number) {
    this.username = username;
    this.active = active;
    this.position = playerPosition;

    this.inventory = new Map<number, Item>();
  }

  addItem(item: Item): void {
    this.inventory.set(item.id, item);
  }

  getUsername(): string {
    return this.username;
  }

  getActive(): boolean {
    return this.active;
  }

  getPosition(): number {
    return this.position;
  }

  getInventory(): Map<number, Item> {
    return this.inventory;
  }

  setPosition(position: number): void {
    this.position = position;
  }
}

export class PartnerPlayer implements Player {
  username: string;
  active: boolean;
  position: number;

  constructor(username: string, active: boolean, playerPosition: number) {
    this.username = username;
    this.active = active;
    this.position = playerPosition;
  }

  getUsername(): string {
    return this.username;
  }

  getActive(): boolean {
    return this.active;
  }

  getPosition(): number {
    return this.position;
  }

  setPosition(position: number): void {
    this.position = position;
  }
}
