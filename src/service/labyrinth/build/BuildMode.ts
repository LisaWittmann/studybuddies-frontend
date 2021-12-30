/**
 * enumeration of steps during labyrinth creation
 */
export enum Mode {
  CREATE = "Labyrinth erstellen",
  START = "Startpositionen",
  END = "Ziel",
  RESTRICTIONS = "Gesperrte Zonen",
  ITEMS = "Gegenstände und Objekte",
}

// temporary filler for roles
// TODO: remove after merge of S007
export enum Role {
  DESIGNER,
  HACKER,
}
