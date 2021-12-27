import { reactive, computed, readonly } from "vue";
import { Labyrinth } from "@/service/labyrinth/Labyrinth";
import { Tile } from "@/service/labyrinth/Tile";
import { Mode, Role } from "@/service/labyrinth/build/BuildMode";
import {
  ItemModel,
  TileModel,
  Vector2,
} from "@/service/labyrinth/build/TileModel";

const buildState = reactive({
  rows: 15,
  columns: 25,
  itemOptions: new Array<ItemModel>(),
  tileModels: new Array<TileModel>(),
  startPositions: new Array<number>(),
  endposition: 0,
});

updateTileModels();

let counter = 1;
const maxRows = 20;
const maxColumns = 30;
const minTiles = 10;
const maxItems = 3;
const startPositons = 2;

/**
 * list of all selected tileModels of new labyrinth
 */
const selectedTiles = computed(() => {
  const selected = buildState.tileModels.filter((model) => model.relationKey);
  return selected.sort((a, b) => {
    return (a.relationKey as number) - (b.relationKey as number);
  });
});

/**
 * set buildState to initial values
 */
function reset(): void {
  buildState.rows = 15;
  buildState.columns = 25;
  buildState.tileModels = new Array<TileModel>();
  buildState.startPositions = new Array<number>();
  buildState.endposition = 0;
}

/**
 * set dimension of labyrinth builder by changing amount of rows and columns
 * and add new created tile models to buildState's tilemodels
 *
 * @param rows: number of row of labyrinth builder (size of x-axis)
 * @param columns: number of columns of labyrinth builder (size of y-axis)
 */
function setDimension(rows: number, columns: number): void {
  if (buildState.rows < maxRows) buildState.rows = rows;
  if (buildState.columns < maxColumns) buildState.columns = columns;
  updateTileModels();
}

async function setItemOptions() {
  await fetch("/api/labyrinth/bodies")
    .then((response) => response.json())
    .then((jsonData) => {
      for (const name of jsonData) {
        if (!buildState.itemOptions.some((i) => i.modelName == name)) {
          buildState.itemOptions.push(new ItemModel(name));
        }
      }
    });
}

/**
 * iterate over rows and columns of labyirnth builder and add
 * not existing tile models to list;
 *
 * iterate over tilerelationmap of each tilemodel
 * and calculate position of neighbor for each orientation,
 * add tile model on calculated posititon (or else undefined)
 * to relation map if entry is empty
 */
function updateTileModels(): void {
  for (let y = 0; y <= buildState.rows; y++) {
    for (let x = 0; x <= buildState.columns; x++) {
      if (!getTileModel(x, y)) {
        buildState.tileModels.push(new TileModel(new Vector2(x, y)));
      }
    }
  }
  for (const model of buildState.tileModels) {
    for (const [key, value] of model.tileRelationMap) {
      const position = model.getNeighbor(key);
      if (!value) {
        model.tileRelationMap.set(key, getTileModel(position.x, position.y));
      }
    }
  }
}

/**
 * mark tilemodels as selectable that have a neighbor that is already selected
 * to prevent invalid tile selection
 */
function setSelectableTiles(): void {
  for (const model of buildState.tileModels) {
    model.isSelectable = false;
    if (!model.relationKey) {
      const neighbors = [...model.tileRelationMap.values()];
      if (neighbors.some((neighbor) => neighbor && neighbor.relationKey)) {
        model.isSelectable = true;
      }
    }
  }
}

/**
 * search for tilemodel in list that is placed at the given position
 * @param x: position on x axis
 * @param y: position on y axis
 * @returns tilemodel or undefined
 */
function getTileModel(x: number, y: number): TileModel | undefined {
  for (const model of buildState.tileModels) {
    if (model.hasPosition(x, y)) return model;
  }
}

/**
 * mark tile as selected and set its relationkey so it will be added to labyrinth
 * @param model tilemodel that was selected and therefore added to labyrinth
 */
function selectTile(model: TileModel): void {
  if (!model.isSelectable) return;
  model.isSelectable = false;
  model.relationKey = counter;
  counter++;
  setSelectableTiles();
}

/**
 * add given tile to starttiles
 * @param model tilemodel to set as a starting position
 */
function addStartTile(model: TileModel): void {
  if (
    !model.relationKey ||
    model.isEnd ||
    model.isStart ||
    model.restrictions.length > 0
  )
    return;
  if (buildState.startPositions.length < 2) {
    buildState.startPositions.push(model.relationKey);
    model.isStart = true;
  }
}

/**
 * remove given tile from starttiles
 * @param model tilemodel to reset as a starting postion
 */
function removeStartTile(model: TileModel) {
  model.isStart = false;
  buildState.startPositions = buildState.startPositions.filter(
    (key) => key != model.relationKey
  );
}

/**
 * set given tile as endtile
 * @param model tilemodel to set as endtile
 */
function addEndTile(model: TileModel): void {
  if (!model.relationKey || model.isStart || model.restrictions.length > 0)
    return;
  if (!buildState.endposition) {
    buildState.endposition = model.relationKey;
    model.isEnd = true;
  }
}

/**
 * reset endtile state if tile is already marked as end
 * @param model tilemodel to reset as endtile
 */
function removeEndTile(model: TileModel): void {
  if (!model.isEnd) return;
  buildState.endposition = 0;
  model.isEnd = false;
}

/**
 * set restriction on tilemodel for given role
 * @param model: tilemodel to add  restriction for role
 * @param role: role that will be restricted for tile
 */
function addRestriction(model: TileModel, role: Role): void {
  if (!model.relationKey || model.isEnd || model.isStart) return;
  if (!model.restrictions?.includes(role)) {
    model.restrictions?.push(role);
  }
}

/**
 * reset restricion on tilemodel for given role
 * @param model: tilemodel to remove restriction for role
 * @param role: role that will be tolerated again for tile
 */
function removeRestriction(model: TileModel, role: Role): void {
  model.restrictions = model.restrictions?.filter((element) => element != role);
}

/**
 * add itemmodel to tilemodels objectsInRoom
 * @param model: tilemodel to add item to
 * @param item: itemmodel to add
 */
function addItem(model: TileModel, item: ItemModel): void {
  if (!model.relationKey || model.objectsInRoom.length >= maxItems || !item)
    return;
  model.objectsInRoom.push(item);
  buildState.itemOptions = buildState.itemOptions.filter(
    (i) => i.modelName != item.modelName
  );
}

/**
 * remove itemmodel from tilemodels objectsInRoom
 * @param model: tilemodel to remove item from
 * @param item: itemmodel to remove
 */
function removeItem(model: TileModel, item: ItemModel): void {
  if (!model.relationKey) return;
  model.objectsInRoom = model.objectsInRoom.filter(
    (i) => i.modelName != item.modelName
  );
  buildState.itemOptions.push(item);
}

/**
 * validates created labyrinth;
 * min amount of tile models must be selected to save labyrinth
 * and number of start and endpositions must be valid
 * @returns build mode that contains errors or undefindes
 */
function hasErrors(): Mode | undefined {
  if (selectedTiles.value.length < minTiles) return Mode.CREATE;
  if (buildState.startPositions.length != startPositons) return Mode.START;
  if (!buildState.endposition) return Mode.END;
  return undefined;
}

/**
 * convert buildState with tilemodels to a labyrinth object
 * @returns data of buildState as labyrinth
 */
function convert(): Labyrinth {
  const labyrinth = new Labyrinth(
    buildState.endposition,
    buildState.startPositions
  );

  for (const model of selectedTiles.value) {
    const key = model.relationKey as number;
    const tile = new Tile(key, []);
    for (const [orientation, neighbor] of model.tileRelationMap) {
      tile.tileRelationMap.set(orientation, neighbor?.relationKey);
    }
    labyrinth.tileMap.set(key, tile);
  }
  return labyrinth;
}

/**
 * convert all complex data structures to objects
 * to parse labyrinth object into a JSON string
 * @param labyrinth object to parse into JSON
 * @returns JSON representation of laybrinth
 */
function parseLabyrinth(labyrinth: Labyrinth): string {
  const tileMapJson = new Map<number, any>();
  for (const [key, tile] of labyrinth.tileMap) {
    tileMapJson.set(key, {
      tileId: tile.tileId,
      objectsInRoom: tile.objectsInRoom,
      tileRelationMap: Object.fromEntries(tile.tileRelationMap),
    });
  }
  return JSON.stringify({
    endTileId: labyrinth.endTileId,
    playerStartTileIds: labyrinth.playerStartTileIds,
    tileMap: Object.fromEntries(tileMapJson),
  });
}

/**
 * convert labyrinth abd save by API call
 * return promise with id of saved labyrinth
 */
async function save(): Promise<number> {
  const labyrinth = convert();
  return fetch("/api/labyrinth/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: parseLabyrinth(labyrinth),
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then((jsondata) => {
      return jsondata as number;
    });
}

export function useBuildService() {
  return {
    buildState: readonly(buildState),
    updateTileModels,
    setDimension,
    setItemOptions,
    getTileModel,
    selectTile,
    addStartTile,
    removeStartTile,
    addEndTile,
    removeEndTile,
    addRestriction,
    removeRestriction,
    addItem,
    removeItem,
    hasErrors,
    save,
    reset,
  };
}
