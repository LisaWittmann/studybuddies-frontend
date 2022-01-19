import { reactive, computed } from "vue";
import { Labyrinth } from "@/service/labyrinth/Labyrinth";
import { Tile } from "@/service/labyrinth/Tile";
import { Item } from "@/service/labyrinth/Item";
import { Mode } from "@/service/editor/EditorMode";
import { Role } from "@/service/game/Player";
import { ItemModel, TileModel, Vector2 } from "@/service/editor/TileModel";
import { editorConfig } from "@/service/editor/EditorConstants";

const editorState = reactive({
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

/**
 * list of all selected tileModels of new labyrinth
 */
const selectedTiles = computed(() => {
  const selected = editorState.tileModels.filter((model) => model.relationKey);
  return selected.sort((a, b) => {
    return (a.relationKey as number) - (b.relationKey as number);
  });
});

/**
 * set editorState to initial values
 */
function reset(): void {
  editorState.rows = 15;
  editorState.columns = 30;
  editorState.tileModels = new Array<TileModel>();
  editorState.startPositions = new Array<number>();
  editorState.endPosition = 0;
  editorState.labyrinthName = "";
  editorState.errorMessage = "";
}

/**
 * set dimension of labyrinth editor by changing amount of rows and columns
 * and add new created tile models to editorState's tile models
 *
 * @param rows: number of row of labyrinth editor (size of x-axis)
 * @param columns: number of columns of labyrinth editor (size of y-axis)
 */
function setDimension(rows: number, columns: number): void {
  if (editorState.rows < editorConfig.maxRows) editorState.rows = rows;
  if (editorState.columns < editorConfig.maxColumns)
    editorState.columns = columns;
  updateTileModels();
}

async function setItemOptions() {
  await fetch("/api/body/placeable-bodies")
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then((jsonData) => {
      console.log(jsonData);
      for (const name in jsonData) {
        if (!editorState.itemOptions.some((i) => i.modelName == name)) {
          editorState.itemOptions.push(
            new ItemModel(name, (<any>Role)[jsonData[name]])
          );
        }
      }
      console.log(editorState.itemOptions);
    });
}

/**
 * iterate over rows and columns of labyrinth editor and add
 * not existing tile models to list;
 *
 * iterate over tile relation map of each tile model
 * and calculate position of neighbor for each orientation,
 * add tile model on calculated position (or else undefined)
 * to relation map if entry is empty
 */
function updateTileModels(): void {
  for (let y = 0; y <= editorState.rows; y++) {
    for (let x = 0; x <= editorState.columns; x++) {
      if (!getTileModel(x, y)) {
        editorState.tileModels.push(new TileModel(new Vector2(x, y)));
      }
    }
  }
  for (const model of editorState.tileModels) {
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
  for (const model of editorState.tileModels) {
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
  for (const model of editorState.tileModels) {
    if (model.hasPosition(x, y)) return model;
  }
}

/**
 * mark tile as selected and set its relation key that it will be added to labyrinth
 * @param model tile model that was selected and therefore added to labyrinth
 */
function addTile(model: TileModel): void {
  if (!model.isSelectable) return;
  model.isSelectable = false;
  model.relationKey = ++counter;
  const endTile = model
    .getNeighborsAsList()
    .find((tileModel) => tileModel.relationKey == editorState.endPosition);
  if (endTile) removeEndTile(endTile);
  setSelectableTiles();
}

function removeTile(model: TileModel): void {
  if (!model.relationKey || model.getNeighborsAsList().length > 1) return;
  model.restrictions = [];
  removeStartTile(model);
  removeEndTile(model);
  for (const itemModel of model.objectsInRoom) {
    removeItem(model, itemModel);
  }
  model.isSelectable = true;
  model.relationKey = undefined;
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
  if (editorState.startPositions.length < editorConfig.maxStartPositions) {
    editorState.startPositions.push(model.relationKey);
    model.isStart = true;
  }
}

/**
 * remove given tile from start tiles
 * @param model tile model to reset as a starting position
 */
function removeStartTile(model: TileModel) {
  model.isStart = false;
  editorState.startPositions = editorState.startPositions.filter(
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
    model.isEnd ||
    model.restrictions.length > 0 ||
    model.getNeighborsAsList().length > 1
  ) {
    return;
  }
  const endTile = editorState.tileModels.find(
    (tileModel) => tileModel.relationKey == editorState.endPosition
  );
  if (endTile) endTile.isEnd = false;
  editorState.endPosition = model.relationKey;
  model.isEnd = true;
}

/**
 * reset end tile state if tile is already marked as end
 * @param model tile model to reset as end tile
 */
function removeEndTile(model: TileModel): void {
  if (!model.isEnd) return;
  editorState.endPosition = 0;
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
  editorState.labyrinthName = labyrinthName;
}

/**
 * add item model to tile models objectsInRoom
 * @param model: tile model to add item to
 * @param item: item model to add
 */
function addItem(model: TileModel, item: ItemModel): void {
  if (
    !item ||
    !model.relationKey ||
    model.isEnd ||
    model.objectsInRoom.length >= editorConfig.maxItems ||
    !isAccessable(item, model)
  )
    return;
  model.objectsInRoom.push(item);
  editorState.itemOptions = editorState.itemOptions.filter(
    (i) => i.modelName != item.modelName
  );
}

function isAccessable(item: ItemModel, tile: TileModel) {
  if (item.blockedRole == undefined) return true;
  if (tile.restrictions.length == 0) return true;
  else return tile.restrictions.includes(item.blockedRole);
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
  editorState.itemOptions.push(item);
}

/**
 * validates created labyrinth;
 * min amount of tile models must be selected to save labyrinth,
 * number of start and end positions must be valid
 * and all items must be places inside of labyrinth
 * @returns editor mode that contains errors or undefined
 */
function hasErrors(): Mode | undefined {
  if (selectedTiles.value.length < editorConfig.minTiles) {
    editorState.errorMessage = "Labyrinth ist zu klein";
    return Mode.CREATE;
  } else if (
    editorState.startPositions.length < editorConfig.minStartPositions
  ) {
    editorState.errorMessage = "Zu wenig Startfelder definiert";
    return Mode.START_TILES;
  } else if (!editorState.endPosition) {
    editorState.errorMessage = "Ende noch nicht definiert";
    return Mode.END_TILE;
  } else if (editorState.itemOptions.length > 0) {
    editorState.errorMessage = "Noch nicht alle Objekte platziert";
    return Mode.ITEM_PLACEMENT;
  } else if (
    editorState.labyrinthName == null ||
    editorState.labyrinthName.trim().length === 0
  ) {
    editorState.errorMessage = "Name noch nicht vergeben";
    return Mode.LABYRINTH_NAME;
  }
  return undefined;
}

/**
 * convert editorState with tile models to a labyrinth object
 * @returns data of editorState as labyrinth
 */
function convert(): Labyrinth {
  for (
    let i = editorState.startPositions.length;
    i < editorConfig.maxStartPositions;
    i++
  ) {
    editorState.startPositions.push(editorState.startPositions[0]);
  }
  const labyrinth = new Labyrinth(
    editorState.labyrinthName,
    editorState.endPosition,
    editorState.startPositions
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
        new Item(0, itemModel.modelName, itemModel.orientations)
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
      editorState.errorMessage =
        'Name "' + editorState.labyrinthName + '" bereits vergeben';
      throw new Error(response.statusText);
    } else if (!response.ok) {
      editorState.errorMessage =
        "Labyrinth ist invalide. Bitte prüfe es erneut";
      throw new Error(response.statusText);
    }

    return response.text();
  });
}

export function useEditorService() {
  return {
    editorState,
    updateTileModels,
    setItemOptions,
    addTile,
    removeTile,
    addEndTile,
    removeEndTile,
    addStartTile,
    removeStartTile,
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
