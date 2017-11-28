class AnimatedTerrain {

    constructor(key, x, y) {

        this.dt = 120;
        this.dt_count = 0;
        this.cf = 0;
        this.maxcf = 3;
    }

    update(dt) {

        if((this.dt_count + dt) >= this.dt) {
            this.dt_count = 0;

            if(this.cf > this.maxcf) {
                this.cf = 0;
            } else {
                this.cf++;
            }
        }
    }

    draw() {
        Renderer.drawImage(MapKey[this.key], 0, 0, this.w, this.h, this.x, this.y, this.w, this.h);
    }
}