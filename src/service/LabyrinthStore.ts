import { reactive, readonly } from "vue";
import { Tile, Orientation, Item } from "@/service/Tile";

/**
 * tileState: Constant to keep the tiles or store an errormessage
 */
const labyrinthState = reactive({
  tileMap: new Map<number, Tile>([]),
  startPosition: [],
  endpoint: Number,
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
        throw new Error(response.statusText);
      }

      return response.json();
    })
    .then((jsondata) => {
      /*
       * Step 1: Setting the LabyrinthState
       */
      labyrinthState.tileMap = jsondata.tileMap;

      /**
       *
       *  Dummy Data
       * @todo: remove
       */

      /*const tileMap = labyrinthState.tileMap;
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
        [-1, 2, -1, 4],
        [-1, -1, 3, 6],
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
      });*/

      /*
       *
       * Step 2: Connecting the Tiles based on the Relation Array of Step 2
       */
      for (const [key, tile] of labyrinthState.tileMap) {
        for (let index = 0; index < 4; index++) {
          if (!tile.getTileRelationMap().get(index)) {
            connectNull(tile, index);
          }
        }
      }
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
    labyrinthState: readonly(labyrinthState),
    updateLabyrinth,
  };
}
