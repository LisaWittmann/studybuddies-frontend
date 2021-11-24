import { Tile } from "@/service/Tile";

/**
 * labyrinth map:
 * contains all tiles with relations
 * contains start and endposition of labyrinth
 */
export class Labyrinth {
  tileMap: Map<number, Tile>;
  startPosition: number[];
  endpoint: number;

  constructor(
    tileMap: Map<number, Tile>,
    startPosition: number[],
    endpoint: number
  ) {
    this.startPosition = startPosition;
    this.endpoint = endpoint;
    this.tileMap = tileMap;
  }
}
