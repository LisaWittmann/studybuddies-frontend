import { reactive, computed } from "vue";
import { Labyrinth } from "../Labyrinth";
import { Tile } from "../Tile";
import { Mode, Role } from "./BuildMode";
import { TileModel, Vector2 } from "./TileModel";

const buildState = reactive({
  rows: 10,
  columns: 20,
  tileModels: new Array<TileModel>(),
  startPositions: new Array<number>(),
  endposiiton: 0,
});

updateTileModels();
let counter = 1;

const selectedTiles = computed(() => {
  return buildState.tileModels.filter((model) => model.relationKey);
});

function setDimension(rows: number, columns: number) {
  buildState.rows = rows;
  buildState.columns = columns;
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
  console.log(buildState);
}

function setSelectableTiles(): void {
  for (const model of buildState.tileModels) {
    model.isSelectable = false;
    if (!model.relationKey) {
      const neighbours = [...model.tileRelationMap.values()];
      if (
        neighbours.filter((neighbour) => neighbour && neighbour.relationKey)
          .length > 0
      ) {
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
  if (model.relationKey) {
    if (model.isStart) {
      buildState.startPositions = buildState.startPositions.filter(
        (key) => key != model.relationKey
      );
      model.isStart = false;
    } else {
      if (buildState.startPositions.length < 2) {
        buildState.startPositions.push(model.relationKey);
        model.isStart = true;
      }
    }
  }
}

function setEndTile(model: TileModel) {
  if (model.relationKey) {
    if (model.isEnd) {
      buildState.endposiiton = 0;
      model.isEnd = false;
    } else {
      if (!buildState.endposiiton) {
        buildState.endposiiton = model.relationKey;
        model.isEnd = true;
      }
    }
  }
}

function setRestriction(model: TileModel, role: Role) {
  if (model.isEnd || model.isStart) return;
  if (model.restrictions?.includes(role)) {
    model.restrictions = model.restrictions?.filter(
      (element) => element != role
    );
  } else {
    model.restrictions?.push(role);
  }
}

function hasErrors(): Mode | undefined {
  if (selectedTiles.value.length < 10) {
    return Mode.CREATE;
  }
  if (buildState.startPositions.length < 1) {
    return Mode.START;
  }
  if (!buildState.endposiiton) {
    return Mode.END;
  }
  return undefined;
}

function transform(): Labyrinth {
  const labyrinth = new Labyrinth(
    buildState.endposiiton,
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
  console.log(labyrinth);
  return labyrinth;
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
    transform,
  };
}
