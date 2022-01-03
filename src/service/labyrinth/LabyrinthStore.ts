import { reactive } from "vue";
import { Tile, Orientation } from "@/service/labyrinth/Tile";
import { Labyrinth } from "@/service/labyrinth/Labyrinth";
import { Item } from "./Item";
import { Vector3 } from "three";

/**
 * constant to keep the tiles or store an errormessage
 */
const labyrinthState: Labyrinth = reactive<Labyrinth>({
  tileMap: new Map<number, Tile>([]),
  endTileId: 0,
  playerStartTileIds: new Array<number>(),
});

/**
 * update the tiles for getting them initially and every time something changes
 * fetches labyrinth object of api and converts response into labyrinth data
 * creates simple fallback labyrinth if fetch fails
 */
async function updateLabyrinthData(lobbyKey: string) {
  console.log("Requested lab of lobby " + lobbyKey);
  //TODO change this to the game api
  await fetch(`/api/lobby/${lobbyKey}`, {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then((jsonData) => {
      console.log('creating new labyrinth')
      const labyrinth = new Labyrinth(
        jsonData.endTileId,
        jsonData.playerStartTileIds
      );

      //iterate over the tiles in the jsondata tileMap to create tiles for every tile in jsonobject
      for (const key in jsonData.tileMap) {
        const tile = jsonData.tileMap[key];
        const id = parseInt(key);
        const objectsInRoom = new Array<Item>();
        for (const item of tile.objectsInRoom) {
          objectsInRoom.push(
            new Item(
              item.id,
              item.modelName,
              item.positionInRoom,
              item.orientations,
              new Vector3()
            )
          );
        }

        labyrinth.tileMap.set(id, new Tile(tile.tileId, objectsInRoom));

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

      labyrinthState.tileMap = labyrinth.tileMap;
      labyrinthState.endTileId = labyrinth.endTileId;
      labyrinthState.playerStartTileIds = labyrinth.playerStartTileIds;
    })
    .catch((error) => {
      console.error(error);
    });
}

/**
 * add uni directional relation from firstTile to secondTile
 * add empty relation if secondTile is undefined
 * @param firstTile: tile on wich relation should be added
 * @param secondTile: tile that sould be added to relation
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
    labyrinthState,
    updateLabyrinthData,
  };
}
