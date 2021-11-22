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
  await fetch("" /*'/api/Labyrinth'*/, {
    //headers: { 'Authorization': `Bearer ${loginstate.jwttoken}` }
  })
    .then((response) => {
      /*if (!response.ok) {
        throw new Error(response.statusText);
      }*/

      return null;
    })
    .then((jsondata) => {

      console.log("bin im fetch");
      //labyrinthState.tileMap = jsondata.tileMap;


      /*
       * Step 1: filling the LabyrinthState with dummydata
      */
      const tileMap = labyrinthState.tileMap;
      tileMap.set(1, new Tile(1, new Map(), [new Item(1)]));
      tileMap.set(2, new Tile(2, new Map(), [new Item(1)]));
      tileMap.set(3, new Tile(3, new Map(), [new Item(1)]));
      tileMap.set(4, new Tile(4, new Map(), [new Item(1)]));
      tileMap.set(5, new Tile(5, new Map(), [new Item(1)]));
      tileMap.set(6, new Tile(6, new Map(), [new Item(1)]));

      /**
       *
       *  Step 2: preparing the dummy connection Array to connect the Tiles in the next step
      */ 
      const relArray = tempTileRelations.relationArray;
      relArray.push(
        [-1, 2, -1, -1],
        [-1, 3, 5, 1],
        [-1, 2, -1, 4],
        [-1, -1, 3, 6],
        [2, -1, -1, -1],
        [4, -1, -1, -1]
      );

      /*
       *
       * Step 3: Connecting the Tiles based on the Relation Array of Step 2
      */
      tileMap.forEach((elem) => {
        for (let index = 0; index < 4; index++) {
          const check = relArray[elem.getId() - 1][index];
          if (check != -1) {
            const secondTile = tileMap.get(check);
            connectTiles(elem, secondTile as Tile, index);
          }
        }
      });

    })
    .catch((fehler) => {
      labyrinthState.errormessage = fehler;
    });

}

/**
 * 
 * Connecting the references from Tile to Tile with its Relation
 * @param firstTile Tile from which is connected
 * @param secondTile Tile to connect to
 * @param orientationRelation orientation to connect from firstTile
 */
function connectTiles(
  firstTile: Tile,
  secondTile: Tile,
  orientationRelation: Orientation
) {
  firstTile.getTileRelationMap().set(orientationRelation, secondTile);
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
