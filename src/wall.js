class Wall {

    constructor(key, x, y, w, h) {

        // [row][col] in map
        this.key = key;

        this.body = new p2.Body({
            position: [x, y],
            type: p2.Body.STATIC
        });

        this.shape = new p2.Box({
            width: w,
            height: h,
            collisionGroup: Constants.groups.GROUP_WALL,
            collisionMask: Constants.groups.GROUP_PLAYER | Constants.groups.GROUP_ENEMY | Constants.groups.GROUP_HOSTAGE | Constants.groups.GROUP_BULLET
        });

        this.body.addShape(this.shape);
    }

    update() {

    }

    draw() {
        Renderer.drawBoxImage(MapKey[this.key].img, this.shape, 0, 0, this.width, this.height, this.x, this.y, this.width, this.width);
    }

    get x() {
        return this.body.position[0];
    }

    get y() {
        return this.body.position[1];
    }

    setX(x) {
        this.body.position[0] = x;
    }

    setY(y) {
        this.body.position[1] = y;
    }
    
    get centerX() {
    	return this.x + (this.width / 2);
    }
    get centerY() {
    	return this.y + (this.height / 2);
    }
    
    get height() {
        return this.shape.width;
    }

    get width() {
        return this.shape.height;
    }

    setWidth(w) {
        this.shape.width = w;
    }
    setHeight(h) {
        this.shape.height = h;
    }
}