
class Button {

    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} w 
     * @param {Number} h 
     * @param {function} cb 
     */
    constructor(x, y, w, h, cb) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;

        this.cb = cb;
    }

    click() {
        this.cb();
    }

    draw() {
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }
}