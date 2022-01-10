import { Tile } from "@/service/labyrinth/Tile";

/**
 * labyrinth class:
 * contains all tiles with relations
 * contains start and end position of labyrinth
 */
export class Labyrinth {
  name: string;
  tileMap: Map<number, Tile>;
  endTileKey: number;
  playerStartTileKeys: number[];

  constructor(name: string, endTileKey: number, playerStartTileKeys: number[]) {
    this.tileMap = new Map<number, Tile>();
    this.name = name;
    this.endTileKey = endTileKey;
    this.playerStartTileKeys = playerStartTileKeys;
  }
}
