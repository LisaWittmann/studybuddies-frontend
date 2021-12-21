import { reactive, computed } from "vue";
import { Labyrinth } from "@/service/labyrinth/Labyrinth";
import { Tile } from "@/service/labyrinth/Tile";
import { Mode, Role } from "./BuildMode";
import { TileModel, Vector2 } from "@/service/labyrinth/build/TileModel";

const buildState = reactive({
  id: 0, // temporary
  rows: 15,
  columns: 25,
  tileModels: new Array<TileModel>(),
  startPositions: new Array<number>(),
  endposition: 0,
});

updateTileModels();

let counter = 1;
const maxRows = 20;
const maxColumns = 30;

const selectedTiles = computed(() => {
  const selected = buildState.tileModels.filter((model) => model.relationKey);
  return selected.sort((a, b) => {
    return (a.relationKey as number) - (b.relationKey as number);
  });
});

function setDimension(rows: number, columns: number) {
  if (buildState.rows < maxRows) buildState.rows = rows;
  if (buildState.columns < maxColumns) buildState.columns = columns;
  updateTileModels();
}

function updateTileModels() {
  for (let y = 0; y <= buildState.rows; y++) {
    for (let x = 0; x <= buildState.columns; x++) {
      if (!getTileModel(x, y)) {
        buildState.tileModels.push(new TileModel(new Vector2(x, y)));
      }
    }
  }
  for (const model of buildState.tileModels) {
    for (const [key, value] of model.tileRelationMap) {
      const position = model.getNeighbour(key);
      if (!value) {
        model.tileRelationMap.set(key, getTileModel(position.x, position.y));
      }
    }
  }
}

function setSelectableTiles(): void {
  for (const model of buildState.tileModels) {
    model.isSelectable = false;
    if (!model.relationKey) {
      const neighbours = [...model.tileRelationMap.values()];
      if (neighbours.some((neighbour) => neighbour && neighbour.relationKey)) {
        model.isSelectable = true;
      }
    }
  }
}

function getTileModel(x: number, y: number) {
  for (const model of buildState.tileModels) {
    if (model.hasPosition(x, y)) return model;
  }
}

function selectTile(model: TileModel) {
  if (!model.isSelectable) return;
  model.isSelectable = false;
  model.relationKey = counter;
  counter++;
  setSelectableTiles();
}

function setStartTile(model: TileModel) {
  if (!model.relationKey || model.restrictions.length > 0) return;
  if (model.isStart) {
    buildState.startPositions = buildState.startPositions.filter(
      (key) => key != model.relationKey
    );
  } else {
    if (buildState.startPositions.length < 2) {
      buildState.startPositions.push(model.relationKey);
    }
  }
  model.isStart = !model.isStart;
}

function setEndTile(model: TileModel) {
  if (!model.relationKey || model.restrictions.length > 0) return;
  if (model.isEnd) buildState.endposition = 0;
  else {
    if (!buildState.endposition) buildState.endposition = model.relationKey;
  }
  model.isEnd = !model.isEnd;
}

function setRestriction(model: TileModel, role: Role) {
  if (!model.relationKey || model.isEnd || model.isStart) return;
  if (model.restrictions?.includes(role)) {
    model.restrictions = model.restrictions?.filter(
      (element) => element != role
    );
  } else {
    model.restrictions?.push(role);
  }
}

function hasErrors(): Mode | undefined {
  if (selectedTiles.value.length < 10) return Mode.CREATE;
  if (buildState.startPositions.length != 2) return Mode.START;
  if (!buildState.endposition) return Mode.END;
  return undefined;
}

function convert(): Labyrinth {
  const labyrinth = new Labyrinth(
    buildState.endposition,
    buildState.startPositions
  );

  for (const model of selectedTiles.value) {
    const key = model.relationKey as number;
    const tile = new Tile(key, []);
    for (const [orientation, neighbour] of model.tileRelationMap) {
      tile.tileRelationMap.set(orientation, neighbour?.relationKey);
    }
    labyrinth.tileMap.set(key, tile);
  }
  return labyrinth;
}

function save(labyrinth: Labyrinth) {
  fetch("/api/labyrinth/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: parseLabyrinth(labyrinth),
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then((jsondata) => (buildState.id = jsondata as number));
}

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

export function useBuildService() {
  return {
    buildState,
    setDimension,
    getTileModel,
    selectTile,
    setStartTile,
    setEndTile,
    setRestriction,
    hasErrors,
    convert,
    save,
  };
}
