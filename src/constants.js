let Constants = {

    groups: {
        GROUP_PLAYER: 1,
        GROUP_WALL: 2,
        GROUP_ENEMY: 4,
        GROUP_HOSTAGE: 8,
        GROUP_BULLET: 16,
    },

    bullet: {
        SPEED_MINIMUM: 5,
        FINISH_RADIUS: 24
    },

    hostage: {
        FOLLOW_RADIUS: 80 // To start / stop following
    }

};

let MapConstants = {
    TILE_WIDTH: 32,
    TILE_HEIGHT: 32,
    x: 0,
    y: 0,
};

let KeyConstants = {

    types: {
        EMPTY: 0,
        SPAWN: 1,
        ASPHALT: 2,
        ASPHALT2: 3,
        CONCRETE: 4,
        GRASS: 5,
        HUTWALL: 6,
        SAFEZONE: 7
    },
};

// these are the groups that differant tiles are grouped into
KeyConstants.walls = [
    // KeyConstants.types.EXAMPLES <- this tiles key would be interpereted as a wall
    KeyConstants.types.HUTWALL
],

KeyConstants.terrain = [
    KeyConstants.types.SPAWN,
    KeyConstants.types.ASPHALT,
    KeyConstants.types.ASPHALT2,
    KeyConstants.types.CONCRETE,
    KeyConstants.types.GRASS,
    KeyConstants.types.SAFEZONE
],

KeyConstants.animatedterrain = {

}