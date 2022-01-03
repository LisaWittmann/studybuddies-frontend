import { Tile } from "@/service/labyrinth/Tile";

/**
 * labyrinth map:
 * contains all tiles with relations
 * contains start and endposition of labyrinth
 */
export class Labyrinth {
  tileMap: Map<number, Tile>;
  endTileKey: number;
  playerStartTileKeys: number[];

  constructor(endTileKey: number, playerStartTileKeys: number[]) {
    this.tileMap = new Map<number, Tile>();
    this.endTileKey = endTileKey;
    this.playerStartTileKeys = playerStartTileKeys;
  }
}
