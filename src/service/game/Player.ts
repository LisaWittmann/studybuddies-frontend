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
  inventory: Map<number, Item>;

  constructor(username: string, active: boolean, playerPosition: number) {
    this.username = username;
    this.active = active;
    this.position = playerPosition;

    //this.inventory = new Map<number, Item>();

    /*dummydata for development
    -> wait for Task #100 to be finished
    */
    this.inventory = new Map<number, Item>([
      [1, new Item(1, "usb", "EAST", ["NORTH", "WEST"], new Vector3(0, 0, 0))],
      [
        2,
        new Item(2, "mouse", "EAST", ["NORTH", "WEST"], new Vector3(0, 0, 0)),
      ],
      [
        3,
        new Item(
          3,
          "keyboard",
          "EAST",
          ["NORTH", "WEST"],
          new Vector3(0, 0, 0)
        ),
      ],
      [
        4,
        new Item(
          4,
          "vr-glasses",
          "EAST",
          ["NORTH", "WEST"],
          new Vector3(0, 0, 0)
        ),
      ],

      [6, new Item(5, "mug", "EAST", ["NORTH", "WEST"], new Vector3(0, 0, 0))],
      /*
      [7, new Item(5, "mug", "EAST", ["NORTH", "WEST"], new Vector3(0, 0, 0))],
      [8, new Item(5, "mug", "EAST", ["NORTH", "WEST"], new Vector3(0, 0, 0))],
      [9, new Item(5, "mug", "EAST", ["NORTH", "WEST"], new Vector3(0, 0, 0))],
      [10, new Item(5, "mug", "EAST", ["NORTH", "WEST"], new Vector3(0, 0, 0))],
      [11, new Item(5, "mug", "EAST", ["NORTH", "WEST"], new Vector3(0, 0, 0))],
      [12, new Item(5, "mug", "EAST", ["NORTH", "WEST"], new Vector3(0, 0, 0))],
      */
    ]);
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

  setPosition(position: number) {
    this.position = position;
  }
}
