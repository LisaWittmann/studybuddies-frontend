import { Tile } from "@/service/Tile";

export class Labyrinth {
  tileMap: Map<number, Tile>;
  startPosition: number[];
  endpoint: number;

  constructor(
    tileMap: Map<number, Tile>,
    startPosition: number[],
    endpoint: number
  ) {
    this.tileMap = tileMap;
    this.startPosition = startPosition;
    this.endpoint = endpoint;
  }
}
