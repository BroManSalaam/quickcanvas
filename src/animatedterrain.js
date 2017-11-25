class AnimatedTerrain {

    constructor(key, x, y) {

        this.dt = 120;
        this.cf = 0;
        this.maxcf = 3;

        this.loop = setInterval(() => {
            if(this.cf > this.maxcf) {
                this.cf = 0;
            } else {
                this.cf++;
            }
        }, this.dt); 
    }

    draw() {
        Renderer.drawImage(MapKey[this.key], 0, 0, this.w, this.h, this.x, this.y, this.w, this.h);
    }
}