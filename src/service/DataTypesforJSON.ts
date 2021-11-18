/**
 * Enumeration to align the tiles according to cardinal points.
 */
enum Orientation {
    north,
    east,
    south,
    west,
}

/**
 * Datatype "Tile" which will be filled by parsing the JSON with the labyrinth structure.
 */
class Tile {
    // "!" -> Not initialized, but no error. Instead you can use a constructor
    id!: number;
    orientation!: Orientation; 
    roomobjects!: []; //not sure if it works like this

    constructor() {}

    getId() {
        return this.id;
    }

    getOrientation(){
        return this.orientation;
    }
}