import { Tile } from "@/service/Tile";

/**
 * labyrinth map:
 * contains all tiles with relations
 * contains start and endposition of labyrinth
 */
export class Labyrinth {
  tileMap: Map<number, Tile>;
  endTileId: number;
  playerStartTileIds: number[];

  constructor(endTileId: number, playerStartTileIds: number[]) {
    this.tileMap = new Map<number, Tile>();
    this.endTileId = endTileId;
    this.playerStartTileIds = playerStartTileIds;
  }
}
