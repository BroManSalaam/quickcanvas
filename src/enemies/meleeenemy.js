class MeleeEnemy extends Enemy {

    constructor(x, y, spd) {
        super();


        this.spd = spd;
        this.velocity_spd = this.spd / 100;

        this.cf = 0;

        this.direction = 0;

        setInterval(() => {

            if (this.cf == MEC.maxcf) {
                this.cf = 0;
            } else {
                this.cf++;
            }

        }, MEC.dt)

        // physics

        this.body = new p2.Body({
            position: [x, y],
            mass: 5,
            type: p2.Body.DYNAMIC,
            angle: 0
        });

        this.shape = new p2.Box({
            width: 128,
            height: 128,
            collisionGroup: Constants.GROUP_ENEMY,
            collisionMask: Constants.GROUP_PLAYER | Constants.GROUP_WALL
        });

        this.body.addShape(this.shape);
    }

    getKeyFrame() {

        if (player.getX() < this.getX()) {
            this.previousY = this.leftY;
            return MEC.leftY;
        }
        if (player.getX() > this.getX()) {
            this.previousY = this.rightY;
            return MEC.rightY;
        }
        if (player.getY() < this.getY()) {
            this.previousY = this.upY;
            return MEC.upY;
        }
        if (player.getY() > this.getY()) {
            this.previousY = this.downY;
            return MEC.downY;
        }

        return this.previousY;
    }

    update() {

        if (player.getX() >= this.getX()) {
            this.setX(this.getX() + this.spd);
        }
        if (player.getX() <= this.getX()) {
            this.setX(this.getX() - this.spd);
        }
        if (player.getY() >= this.getY()) {
            this.setY(this.getY() + this.spd);
        }
        if (player.getY() <= this.getY()) {
            this.setY(this.getY() - this.spd);
        }
    }

    draw() {
        Renderer.drawImage(MEC.img, MEC.spr_width * this.cf, this.getKeyFrame(), MEC.spr_width, MEC.spr_height,
            this.getX() - this.getWidth() / 2, this.getY() - this.getHeight() / 2, this.getWidth(), this.getHeight());
    }

    drawBoundingBox() {

        Renderer.drawShapeBoundingBox(this.shape, this.getX(), this.getY(), this.getWidth(), this.getHeight());
    }


    drawPosition() {
        ctx.fillStyle = "blue";
        Renderer.fillRect(this.getX(), this.getY(), 5, 5);
        ctx.fillStyle = "black";
    }

    getX() {
        return this.body.position[0];
    }

    getY() {
        return this.body.position[1];
    }

    setX(x) {
        this.body.position[0] = x;
    }

    setY(y) {
        this.body.position[1] = y;
    }

    getWidth() {
        return this.shape.width;
    }

    getHeight() {
        return this.shape.height;
    }

}