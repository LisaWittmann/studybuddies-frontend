import { reactive, computed } from "vue";
import { Labyrinth } from "@/service/labyrinth/Labyrinth";
import { Tile } from "@/service/labyrinth/Tile";
import { Item } from "@/service/labyrinth/Item";
import { Mode } from "@/service/labyrinth/build/BuildMode";
import { Role } from "@/service/game/Player";
import {
  ItemModel,
  TileModel,
  Vector2,
} from "@/service/labyrinth/build/TileModel";

const buildState = reactive({
  rows: 15,
  columns: 30,
  itemOptions: new Array<ItemModel>(),
  tileModels: new Array<TileModel>(),
  startPositions: new Array<number>(),
  endPosition: 0,
  labyrinthName: "",
  errorMessage: "",
});

updateTileModels();

let counter = 1;
const maxRows = 20;
const maxColumns = 40;
const minTiles = 10;
const maxItems = 3;
const startPositions = 2;

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
  buildState.columns = 30;
  buildState.tileModels = new Array<TileModel>();
  buildState.startPositions = new Array<number>();
  buildState.endPosition = 0;
  buildState.labyrinthName = "";
  buildState.errorMessage = "";
}

/**
 * set dimension of labyrinth builder by changing amount of rows and columns
 * and add new created tile models to buildState's tile models
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
  await fetch("/api/labyrinth/placeable-bodies")
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
 * iterate over rows and columns of labyrinth builder and add
 * not existing tile models to list;
 *
 * iterate over tile relation map of each tile model
 * and calculate position of neighbor for each orientation,
 * add tile model on calculated position (or else undefined)
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
      const position = model.getNeighborPosition(key);
      if (!value) {
        model.tileRelationMap.set(key, getTileModel(position.x, position.y));
      }
    }
  }
}

/**
 * mark tile models as selectable that have a neighbor that is already selected
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
 * search for tile model in list that is placed at the given position
 * @param x: position on x-axis
 * @param y: position on y-axis
 * @returns tile model or undefined
 */
function getTileModel(x: number, y: number): TileModel | undefined {
  for (const model of buildState.tileModels) {
    if (model.hasPosition(x, y)) return model;
  }
}

/**
 * mark tile as selected and set its relation key that it will be added to labyrinth
 * @param model tile model that was selected and therefore added to labyrinth
 */
function selectTile(model: TileModel): void {
  if (!model.isSelectable) return;
  model.isSelectable = false;
  model.relationKey = ++counter;
  const endTile = model
    .getNeighborsAsList()
    .find((tileModel) => tileModel.relationKey == buildState.endPosition);
  if (endTile) removeEndTile(endTile);
  setSelectableTiles();
}

/**
 * add given tile to start tiles
 * @param model tile model to set as a starting position
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
 * remove given tile from start tiles
 * @param model tile model to reset as a starting position
 */
function removeStartTile(model: TileModel) {
  model.isStart = false;
  buildState.startPositions = buildState.startPositions.filter(
    (key) => key != model.relationKey
  );
}

/**
 * set given tile as end tile
 * @param model tile model to set as end tile
 */
function addEndTile(model: TileModel): void {
  if (
    !model.relationKey ||
    model.isStart ||
    model.restrictions.length > 0 ||
    model.getNeighborsAsList().length > 1
  ) {
    return;
  }
  const endTile = buildState.tileModels.find(
    (tileModel) => tileModel.relationKey == buildState.endPosition
  );
  if (endTile) endTile.isEnd = false;
  buildState.endPosition = model.relationKey;
  model.isEnd = true;
}

/**
 * reset end tile state if tile is already marked as end
 * @param model tile model to reset as end tile
 */
function removeEndTile(model: TileModel): void {
  if (!model.isEnd) return;
  buildState.endPosition = 0;
  model.isEnd = false;
}

/**
 * set restriction on tile model for given role
 * @param model: tile model to add  restriction for role
 * @param role: role that will be restricted for tile
 */
function addRestriction(model: TileModel, role: Role): void {
  if (!model.relationKey || model.isEnd || model.isStart) return;
  if (!model.restrictions?.includes(role)) {
    model.restrictions?.push(role);
  }
}

/**
 * reset restriction on tile model for given role
 * @param model: tile model to remove restriction for role
 * @param role: role that will be tolerated again for tile
 */
function removeRestriction(model: TileModel, role: Role): void {
  model.restrictions = model.restrictions?.filter((element) => element != role);
}

/**
 * overwrite current labyrinthName with new one
 * @param labyrinthName contains the new name for the labyrinth
 */
function setName(labyrinthName: string): void {
  buildState.labyrinthName = labyrinthName;
}

/**
 * add item model to tile models objectsInRoom
 * @param model: tile model to add item to
 * @param item: item model to add
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
 * remove item model from tile models objectsInRoom
 * @param model: tile model to remove item from
 * @param item: item model to remove
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
 * min amount of tile models must be selected to save labyrinth,
 * number of start and end positions must be valid
 * and all items must be places inside of labyrinth
 * @returns build mode that contains errors or undefined
 */
function hasErrors(): Mode | undefined {
  if (selectedTiles.value.length < minTiles) {
    buildState.errorMessage = "Labyrinth ist zu klein";
    return Mode.CREATE;
  } else if (buildState.startPositions.length != startPositions) {
    buildState.errorMessage = "Zu wenig Startfelder definiert";
    return Mode.START_TILES;
  } else if (!buildState.endPosition) {
    buildState.errorMessage = "Ende noch nicht definiert";
    return Mode.END_TILE;
  } else if (buildState.itemOptions.length > 0) {
    buildState.errorMessage = "Noch nicht alle Objekte platziert";
    return Mode.ITEM_PLACEMENT;
  } else if (
    buildState.labyrinthName == null ||
    buildState.labyrinthName.trim().length === 0
  ) {
    buildState.errorMessage = "Name noch nicht vergeben";
    return Mode.LABYRINTH_NAME;
  }
  return undefined;
}

/**
 * convert buildState with tile models to a labyrinth object
 * @returns data of buildState as labyrinth
 */
function convert(): Labyrinth {
  const labyrinth = new Labyrinth(
    buildState.labyrinthName,
    buildState.endPosition,
    buildState.startPositions
  );

  for (const tileModel of selectedTiles.value) {
    const key = tileModel.relationKey as number;
    const tile = new Tile(key, [], tileModel.restrictions);
    for (const [orientation, neighbor] of tileModel.tileRelationMap) {
      tile.tileRelationMap.set(orientation, neighbor?.relationKey);
    }
    tileModel.setPlacements();
    for (const itemModel of tileModel.objectsInRoom) {
      const orientations =
        tileModel.placements[
          Math.floor(Math.random() * tileModel.placements.length)
        ];
      itemModel.orientations = orientations;
      tileModel.removePlacement(orientations);
      tile.objectsInRoom.push(
        new Item(
          0,
          itemModel.modelName,
          itemModel.positionInRoom,
          itemModel.orientations
        )
      );
    }
    labyrinth.tileMap.set(key, tile);
  }
  return labyrinth;
}

/**
 * convert all complex data structures into objects
 * to parse labyrinth object into a JSON string
 * @param labyrinth object to parse into JSON
 * @returns JSON representation of labyrinth
 */
function parseLabyrinth(labyrinth: Labyrinth): string {
  const tileMapJson = new Map<number, any>();
  for (const [key, tile] of labyrinth.tileMap) {
    tileMapJson.set(key, {
      tileId: tile.tileId,
      objectsInRoom: tile.objectsInRoom.map((item) => item.toJsonObject()),
      restrictions: tile.restrictions.map((restriction) => Role[restriction]),
      tileRelationMap: Object.fromEntries(tile.tileRelationMap),
    });
  }
  return JSON.stringify({
    labyrinthName: labyrinth.name,
    endTileKey: labyrinth.endTileKey,
    playerStartTileKeys: labyrinth.playerStartTileKeys,
    tileMap: Object.fromEntries(tileMapJson),
  });
}

/**
 * convert labyrinth and save by API call
 * return promise with id of saved labyrinth
 */
async function save(): Promise<string> {
  const labyrinth = convert();
  return fetch("/api/labyrinth/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: parseLabyrinth(labyrinth),
  }).then((response) => {
    if (response.status === 409) {
      buildState.errorMessage =
        'Name "' + buildState.labyrinthName + '" bereits vergeben';
      throw new Error(response.statusText);
    } else if (!response.ok) {
      buildState.errorMessage = "Labyrinth ist invalide. Bitte prüfe es erneut";
      throw new Error(response.statusText);
    }

    return response.text();
  });
}

export function useBuildService() {
  return {
    buildState,
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
    setName,
    hasErrors,
    save,
    reset,
  };
}
