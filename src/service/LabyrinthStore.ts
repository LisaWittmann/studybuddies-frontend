import { reactive } from "vue";
import { Tile, Orientation, Item } from "@/service/Tile";
import { Labyrinth } from "@/service/Labyrinth";

/**
 * tileState: Constant to keep the tiles or store an errormessage
 */
const labyrinthState = reactive({
  tileMap: new Map<number, Tile>([]),
  startPosition: new Array<number>(),
  endpoint: 0,
  errormessage: "",
});

const tempTileRelations = reactive({
  relationArray: Array<Array<number>>(),
});

/**
 * updateLabyrinth: to update the Tiles for getting them initially and every time something changes.
 */
async function updateLabyrinth() {
  await fetch("/api/labyrinth/1", {
    method: "GET",
    //headers: { 'Authorization': `Bearer ${loginstate.jwttoken}` }
  })
    .then((response) => {
      if (!response.ok) {
        /*
        // load testing data if fetch is not possible
        //const map = new Map<number, Tile>();

        //const tileMap = labyrinthState.tileMap;
        tileMap.set(1, new Tile(1, new Map(), [new Item(1)]));
        tileMap.set(2, new Tile(2, new Map(), [new Item(1)]));
        tileMap.set(3, new Tile(3, new Map(), [new Item(1)]));
        tileMap.set(4, new Tile(4, new Map(), [new Item(1)]));
        tileMap.set(5, new Tile(5, new Map(), [new Item(1)]));
        tileMap.set(6, new Tile(6, new Map(), [new Item(1)]));
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
            if (check != -1) {
              const secondTile = tileMap.get(check);
              connectTiles(elem, secondTile as Tile, index);
            } else {
              connectNull(elem, index);
            }
          }
        });

        labyrinthState.tileMap = tileMap;

        */

        throw new Error(response.statusText);
      }

      return response.json();
    })
    .then((jsondata) => {
      /*
       * Step 1: Setting the LabyrinthState
       */

      const test = jsondata.tileMap;

      const map = new Map<number, Tile>();

      for (const value in jsondata.tileMap) {
        map.set(
          parseInt(value),
          new Tile(parseInt(value), undefined, new Array<Item>())
        );

        const map2 = new Map<Orientation, number | undefined>();

        for (const value2 in jsondata.tileMap[value].tileRelationMap) {
          const nr: number = parseInt(value2);
          let ori: Orientation;
          //const test: Orientation = parseInt(value2);
          switch (value2) {
            case "NORTH":
              ori = Orientation.NORTH;
              break;
            case "EAST":
              ori = Orientation.EAST;
              break;
            case "SOUTH":
              ori = Orientation.SOUTH;
              break;
            case "WEST":
              ori = Orientation.WEST;
              break;
            default:
              ori = Orientation.EAST;
              break;
          }

          map2.set(
            ori,
            parseInt(jsondata.tileMap[value].tileRelationMap[value2])
          );
        }

        const test = map2.entries();

        (map.get(parseInt(value)) as Tile).setTileRelationMap(map2);
      }

      for (const [key, tile] of map) {
        for (let index = 0; index < 4; index++) {
          if (!tile.getTileRelationMap().get(index)) {
            connectNull(tile, index);
          }
        }
      }

      labyrinthState.tileMap = map;
    })
    .catch((fehler) => {
      labyrinthState.errormessage = fehler;
    });
}

/**
 *
 * Connecting the references from Tile to Tile with its Relation
 * @param firstTile Tile from which is connected
 * @param orientationRelation orientation to connect from firstTile
 */
function connectNull(firstTile: Tile, orientationRelation: Orientation) {
  firstTile.getTileRelationMap().set(orientationRelation, undefined);
}

function connectTiles(
  firstTile: Tile,
  secondTile: Tile,
  orientationRelation: Orientation
) {
  firstTile.getTileRelationMap().set(orientationRelation, secondTile.getId());
}

/**
 *
 * @returns the function to use them somewhere else with import
 */
export function useLabyrinthStore() {
  return {
    labyrinthState,
    updateLabyrinth,
  };
}
