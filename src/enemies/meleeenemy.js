class MeleeEnemy extends Enemy {

    constructor(x, y, spd) {
        super();
        
        this.hp = 100;

        this.spd = spd;
        this.velocity_spd = this.spd / 100;

        this.cf = 0;
        this.dt_count = 0;

        this.direction = 0;
        // physics

        this.body = new p2.Body({
            position: [x, y],
            mass: 5,
            type: p2.Body.DYNAMIC,
            angle: 0,
        });

        this.shape = new p2.Box({
            width: 64,
            height: 64,
            collisionGroup: Constants.groups.GROUP_ENEMY,
            collisionMask: Constants.groups.GROUP_PLAYER | Constants.groups.GROUP_WALL | Constants.groups.GROUP_ENEMY | Constants.groups.GROUP_HOSTAGE | Constants.groups.GROUP_BULLET
        });

        this.body.addShape(this.shape);
    }

    getKeyFrame() {

        if (player.y < this.y) {
            this.previousY = this.upY;
            return mec_default.upY;
        }
        if (player.y > this.y) {
            this.previousY = this.downY;
            return mec_default.downY;
        }
        if (player.x < this.x) {
            this.previousY = this.leftY;
            return mec_default.leftY;
        }
        if (player.x > this.x) {
            this.previousY = this.rightY;
            return mec_default.rightY;
        }

        return this.previousY;
    }

    update(dt) {
        // if we passed over the delta time, increment the frame count if we are not already at the max
        this.dt_count = (dt || 1/60) + (this.dt_count || 0);

        if (this.dt_count >= mec_default.dt) {
            
            if(this.cf < mec_default.maxcf) {
                this.cf++
            } else {
                this.cf = 0;
            }

            this.dt_count = 0;
        }

        if (player.x >= this.x) {
            this.velocity[0] = mec_default.velocity_start;
        }
        if (player.x <= this.x) {
            this.velocity[0] = -mec_default.velocity_start;
        }
        if (player.y >= this.y) {
            this.velocity[1] = mec_default.velocity_start;
        }
        if (player.y <= this.y) {
            this.velocity[1] = -mec_default.velocity_start;
        }
    }

    draw() {
        Renderer.drawImage(mec_default.img, mec_default.spr_width * this.cf, this.getKeyFrame(), mec_default.spr_width, mec_default.spr_height,
            this.x, this.y, this.width, this.height);

    }
    
    drawBoundingBox() {
        Renderer.drawShapeBoundingBox(this.shape, this.centerX, this.centerY, this.width, this.height);
    }
    
    get velocity() {
        return this.body.velocity;
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
    
    get width() {
        return this.shape.width;
    }

    get height() {
        return this.shape.height;
    }
    
    get centerX() {
    	return this.x + (this.width / 2);
    }
    get centerY() {
    	return this.y + (this.height / 2);
    }

}