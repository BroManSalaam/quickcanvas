let Constants = {

    groups : {
        GROUP_PLAYER : 1,
        GROUP_WALL : 2,
        GROUP_ENEMY : 4, 
        GROUP_HOSTAGE : 8,
        GROUP_BULLET : 16,
    },
    
	bullet : {
		SPEED_MINIMUM : 50,
		FINISH_RADIUS : 24
	},
	
	hostage: {
		FOLLOW_RADIUS: 80 // To start / stop following
	}

};

let MapConstants = {
    TILE_WIDTH: 64,
    TILE_HEIGHT: 64,
    x: 0,
    y: 0,
};

let KeyConstants = {
    EMPTY : 0,
    SPAWN : 1,
    TERRAIN : 2,
    WALL : 3,
    ANIMATED : 4
};