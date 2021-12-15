import { Item } from "@/service/labyrinth/Item";
import { Vector3 } from "three";

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
  /*dummydata for development
    -> wait for Task #100 to be finished
  */
  inventory: Item[] = [
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
  ];

  constructor(username: string, active: boolean, playerPosition: number) {
    this.username = username;
    this.active = active;
    this.position = playerPosition;
    //this.inventory = new Array<Item>();
  }

  addItem(item: Item): void {
    this.inventory.push(item);
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

  getInventory(): Array<Item> {
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

  setPosition(position: number) {
    this.position = position;
  }
}
