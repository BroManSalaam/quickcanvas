class AnimatedTerrain {

    constructor(key, dt, x, y) {

        this.x = x;
        this.y = y;

        this.key = key;

        this.dt = dt;
        this.dt_count = 0;
        this.cf = 0;
        this.maxcf = 2;
    }

    update(dt) {

        if ((this.dt_count += (dt || 1 / 60)) > this.dt) {
            this.dt_count = 0;

            if (this.cf >= this.maxcf) {
                this.cf = 0;
            } else {
                this.cf++;
            }
        }
    }

    draw() {
        Renderer.drawImage(MapKey[this.key].img, MapConstants.TILE_WIDTH * this.cf, 0, MapConstants.TILE_WIDTH, MapConstants.TILE_HEIGHT,
            this.x - MapConstants.TILE_WIDTH / 2, this.y - MapConstants.TILE_HEIGHT / 2, MapConstants.TILE_WIDTH, MapConstants.TILE_HEIGHT);
    }
}