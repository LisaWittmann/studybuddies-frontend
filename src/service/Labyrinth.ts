import { Tile } from "@/service/Tile";

export interface TileMap {
  id: number;
  tile: Tile;
}
export class Labyrinth {
  tileMap: Map<number, Tile>;
  startPosition: number[];
  endpoint: number;

  constructor(tileMap: TileMap[], startPosition: number[], endpoint: number) {
    this.startPosition = startPosition;
    this.endpoint = endpoint;
    this.tileMap = new Map<number, Tile>();
    for (const tile of tileMap) {
      this.tileMap.set(tile.id, tile.tile);
    }
  }
}
