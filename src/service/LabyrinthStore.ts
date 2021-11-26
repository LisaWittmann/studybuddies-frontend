import { reactive } from "vue";
import { Tile, Orientation, Item } from "@/service/Tile";

/**
 * constant to keep the tiles or store an errormessage
 */
const labyrinthState = reactive({
  tileMap: new Map<number, Tile>([]),
  startPosition: new Array<number>(),
  endpoint: 0,
  errormessage: "",
});

/**
 * helper to connect the fallback labyrinth
 */
const tempTileRelations = reactive({
  relationArray: Array<Array<number>>(),
});

/**
 * update the tiles for getting them initially and every time something changes
 * fetches labyrnith object of api and converts response into labyrinth data
 * creates simple fallback labyrinth if fetch fails
 */
async function updateLabyrinth() {
  await fetch("/api/labyrinth/1", {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        // load fallback labyrinth if fetch is not possible
        const tileMap = labyrinthState.tileMap;
        tileMap.set(1, new Tile(1, [new Item(1)]));
        tileMap.set(2, new Tile(2, [new Item(1)]));
        tileMap.set(3, new Tile(3, [new Item(1)]));
        tileMap.set(4, new Tile(4, [new Item(1)]));
        tileMap.set(5, new Tile(5, [new Item(1)]));
        tileMap.set(6, new Tile(6, [new Item(1)]));
        const relArray = tempTileRelations.relationArray;
        relArray.push(
          [-1, 2, -1, -1],
          [-1, 3, 5, 1],
          [-1, 4, -1, 2],
          [-1, -1, 6, 3],
          [2, -1, -1, -1],
          [4, -1, -1, -1]
        );

        tileMap.forEach((elem) => {
          for (let index = 0; index < 4; index++) {
            const check = relArray[elem.getId() - 1][index];
            const secondTile = tileMap.get(check);
            connectTiles(elem, index, secondTile as Tile);
          }
        });

        labyrinthState.tileMap = tileMap;

        throw new Error(response.statusText);
      }

      return response.json();
    })
    .then((jsondata) => {
      //create an empty map to fill it with the jsondata
      const tileMap = new Map<number, Tile>();

      //iterates over the tiles in the jsondata tileMap to create tiles for every tile in jsonobject
      for (const jsonTile in jsondata.tileMap) {
        tileMap.set(
          parseInt(jsonTile),
          new Tile(parseInt(jsonTile), new Array<Item>())
        );

        //workaround to parse json list in map
        const tileRelationMap = new Map<Orientation, number | undefined>();

        for (const jsonOrientation in jsondata.tileMap[jsonTile]
          .tileRelationMap) {
          let orientation: Orientation;
          switch (jsonOrientation) {
            case "NORTH":
              orientation = Orientation.NORTH;
              break;
            case "EAST":
              orientation = Orientation.EAST;
              break;
            case "SOUTH":
              orientation = Orientation.SOUTH;
              break;
            case "WEST":
              orientation = Orientation.WEST;
              break;
            default:
              orientation = Orientation.EAST;
              break;
          }

          tileRelationMap.set(
            orientation,
            parseInt(
              jsondata.tileMap[jsonTile].tileRelationMap[jsonOrientation]
            )
          );
        }

        (tileMap.get(parseInt(jsonTile)) as Tile).setTileRelationMap(
          tileRelationMap
        );
      }

      //add empty relations for unset orientations of tilemap
      for (const [, tile] of tileMap) {
        for (let index = 0; index < 4; index++) {
          if (!tile.getTileRelationMap().get(index)) {
            connectTiles(tile, index, undefined);
          }
        }
      }

      labyrinthState.tileMap = tileMap;
    })
    .catch((fehler) => {
      labyrinthState.errormessage = fehler;
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
    updateLabyrinth,
  };
}
