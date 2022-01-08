/**
 * enumeration of steps during labyrinth creation
 */
export enum Mode {
  CREATE = "Labyrinth erstellen",
  START_TILES = "Startpositionen",
  END_TILE = "Ziel",
  RESTRICTION_PLACEMENT = "Gesperrte Zonen",
  ITEM_PLACEMENT = "Gegenstände und Objekte",
  LABYRINTH_NAME = "Labyrinth benennen"
}

// temporary filler for roles
// TODO: remove after merge of S007
export enum Role {
  DESIGNER,
  HACKER,
}
