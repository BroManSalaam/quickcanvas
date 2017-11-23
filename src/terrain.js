
/**
 * something in the world that has a sprite and maybe an animation but no body
 */
class Terrain {

    constructor(key, x, y) {

        this.key = key;

        this.x = x,
        this.y = y;
    }

    draw() {
        Renderer.drawImage(MapKey[this.key].img, 0, 0, 64, 64, this.x - 32, this.y - 32, 64, 64);
    }
}