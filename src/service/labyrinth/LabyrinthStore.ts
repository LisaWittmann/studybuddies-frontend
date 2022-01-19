import { Tile, Orientation } from "@/service/labyrinth/Tile";
import { Labyrinth } from "@/service/labyrinth/Labyrinth";
import { Item } from "@/service/labyrinth/Item";
import { Role } from "@/service/game/Player";

/**
 * update the tiles for getting them initially and every time something changes
 * fetches labyrinth object of api and converts response into labyrinth data
 * creates simple fallback labyrinth if fetch fails
 */
async function updateLabyrinthData(lobbyKey: string): Promise<Labyrinth> {
  console.log("Requested lab of lobby " + lobbyKey);
  return fetch(`/api/lobby/${lobbyKey}`, {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then((jsonData) => {
      console.log("creating new labyrinth");
      const labyrinth = new Labyrinth(
        jsonData.name,
        jsonData.endTileKey,
        jsonData.playerStartTileKeys
      );

      //iterate over the tiles in the json data tileMap to create tiles for every tile in json object
      for (const tileKey in jsonData.tileMap) {
        const tile = jsonData.tileMap[tileKey];
        const id = parseInt(tileKey);
        const objectsInRoom = new Array<Item>();

        for (const itemKey in tile.objectsInRoom) {
          const item = tile.objectsInRoom[itemKey];
          const orientations = new Array<Orientation>();

          for (const orientation of item.orientations) {
            orientations.push((<any>Orientation)[orientation]);
          }
          objectsInRoom.push(new Item(item.id, item.modelName, orientations));
        }
        const restrictions = new Array<Role>();
        for (const role of tile.restrictions) {
          restrictions.push((<any>Role)[role]);
        }
        labyrinth.tileMap.set(
          id,
          new Tile(tile.tileId, objectsInRoom, restrictions)
        );

        //workaround to parse json list in map
        const tileRelationMap = new Map<Orientation, number | undefined>();
        for (const orientationKey in tile.tileRelationMap) {
          tileRelationMap.set(
            (<any>Orientation)[orientationKey],
            parseInt(tile.tileRelationMap[orientationKey])
          );
        }

        labyrinth.tileMap.get(id)?.setTileRelationMap(tileRelationMap);
      }
      //add empty relations for unset orientations of tilemap
      for (const [, tile] of labyrinth.tileMap) {
        for (let index = 0; index < 4; index++) {
          if (!tile.getTileRelationMap().get(index)) {
            connectTiles(tile, index, undefined);
          }
        }
      }

      return labyrinth;
    });
}

/**
 * add uni directional relation from firstTile to secondTile
 * add empty relation if secondTile is undefined
 * @param firstTile: tile on which relation should be added
 * @param secondTile: tile that should be added to relation
 * @param orientationRelation: orientation in which relation should be added
 */
function connectTiles(
  firstTile: Tile,
  orientationRelation: Orientation,
  secondTile: Tile | undefined
) {
  firstTile.getTileRelationMap().set(orientationRelation, secondTile?.getId());
}

export function useLabyrinthStore() {
  return {
    updateLabyrinthData,
  };
}
