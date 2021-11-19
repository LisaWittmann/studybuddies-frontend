import { reactive, readonly } from "vue";
import { Tile } from "./DataTypesforJSON";

/**
 * tileState: Constant to keep the tiles or store an errormessage
 */
const tileState = reactive({
    tiles: Array<Tile>(),
    errormessage: "" 
})

/**
 * updateLabyrinth: to update the Tiles for getting them initially and every time something changes.
 */
async function updateLabyrinth() {

    await fetch('/api/Labyrinth', {
        method: 'GET',
        //headers: { 'Authorization': `Bearer ${loginstate.jwttoken}` }
    })
    .then( (response) => {
        if(!response.ok) {
            throw new Error(response.statusText);
        }

        return response.json();
    })
    .then( (jsondata) => {

        tileState.tiles = jsondata.tile;

    })
    .catch( (fehler) => {
        tileState.errormessage = fehler;
    });

}

/**
 * 
 * @returns the function to use them somewhere else with import
 */
export function useLabyrinthStore()  {

    return {
        tileState: readonly(tileState),
        updateLabyrinth
    };
}