import { readonly } from "vue";
import { Mode } from "./EditorMode";

export const editorConfig = readonly({
  maxRows: 20,
  maxColumns: 40,
  minTiles: 10,
  maxItems: 3,
  maxStartPositions: 2,
  minStartPositions: 1,
});

/**
 * editor instructions mapped to each mode
 */
export const instructions = readonly(
  new Map([
    [
      Mode.CREATE,
      "Als erstes kannst du den Grundriss für dein Labyrinth festlegen, dabei sind dir fast keine Grenzen gesetzt. Allerdings müssen alle neuen Felder an ein bereits besetehendes Feld platziert werden, damit die beiden Hörnchen das gesamte Labyrinth erkunden können.",
    ],
    [
      Mode.START_TILES,
      `In diesem Schritt legst du fest, wo die Hörnchen im Labyrinth starten. Du kannst dabei entweder ${editorConfig.maxStartPositions} unterschiedliche oder auch nur ${editorConfig.minStartPositions} Startpunkt festlegen. Bitte beachte, dass eine Startposition weder eine Beschränkung für eine Rolle haben darf, noch gleichzeitig das Ziel sein sollte.`,
    ],
    [
      Mode.END_TILE,
      "Nun kannst du den Ausgang des Labyrinthes festlegen. Bitte beachte, dass das Ziel deshalb immer das Ende eines Ganges sein muss. Du darfst hier leider keine Objekte platzieren, da eine besondere Überraschung am Ende wartet. Zudem muss das Feld für beide Hörnchen begehbar sein. Klingt logisch, oder?",
    ],
    [
      Mode.RESTRICTION_PLACEMENT,
      "In diesem Schritt kannst du festlegen, ob eines der Hörnchen ein Feld nicht betreten darf. Bleib dabei aber fair und gebe beiden Hörnchen die Chance möglichst viel von deinem Labyrinth erkunden zu können.",
    ],
    [
      Mode.ITEM_PLACEMENT,
      `Nun darfst du entscheiden, wo die begehrten Gegenstände zu finden sind. Damit es ein bisschen mehr zu suchen gibt, darfst du allerdings maximal ${editorConfig.maxItems} Objekte in einer Kachel platzieren. Objekte, die von einer bestimmten Rolle nicht genutzt werden können, sind farbig markiert. Diese dürfen auf den Felder platziert werden, die für alle Rollen zugänglich sind oder auf einem Feld der entsprechenden Farbe.`,
    ],
    [
      Mode.LABYRINTH_NAME,
      "Zuletzt solltest du deinem Labyrinth einen beschreibenden Namen geben, dabei darfst du gerne kreativ werden. Fasse dich aber bitte ein bisschen kurz",
    ],
  ])
);
