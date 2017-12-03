
/**
 * all entities prepended with spr_ are purely for textual purposes and have no correlation to the rendered version of the game
 * 
 * width and height depict on the size of the player in the actual world in pixels
 */
class Player {

    constructor(x, y, spd) {

        // position & animation
        this.spr_width = 64;
        this.spr_height = 64;

        this.cf = 3;
        // maxcf is the total number of animation frames a sheet has
        this.maxcf = 13;

        this.dt = 100;
        this.dt_max = 75;
        this.dt_count = 0;

        this.img = new Image();
        
        this.isLeft = false;
        this.isRight = false;
        this.isDown = false;
        this.isUp = false;
        this.shouldFollow = false; // Is the following key pressed?

        // the position on the spritesheet where each directional frame starts eg: the down walking animation may start at 0
//        this.leftY = 1184;
//        this.rightY = 592;
//        this.downY = 0;
//        this.upY = 1846;
//        this.previousY = 0;

        // Physics

        this.spd = spd;
        this.velocity_spd = 3.3;
        // starting velocity after direction change
        this.velocity_start = 55;

        // maximum velocity achievable by player through normal movement
        // set this slightly lower than what you want the maximum to be due to the amount of time it takes to update from input
        this.velocity_max = 100;
        // rate at which the velocity returns to zero if the player decides to suddenly change direction
        this.velocity_decay = this.velocity_spd * 8;

        this.body = new p2.Body({
            position: [x, y],
            mass: 1,
            type: p2.Body.DYNAMIC
        });

        this.shape = new p2.Box({
            width: 64,
            height: 64,
            collisionGroup: Constants.GROUP_PLAYER,
            collisionMask: Constants.groups.GROUP_WALL | Constants.groups.GROUP_ENEMY | Constants.groups.GROUP_HOSTAGE
        });

        this.body.addShape(this.shape);
        
        
        // bullets
        this.projectile = null;
        this.bullet_spd = 700;
        // if this.proj has already been added to the 
        this.bullet_isAdded = true;
        
    }
    
    load() {
        return new Promise((resolve, reject) => {

            let start = Date.now();
            this.img.src = "src/assets/spritesheets/player.png";

            this.img.onload = () => {
                resolve(Date.now() - start);
            }
            this.img.onerror = () => {
                reject();
            }
        });
    }

    // get what direction the player is in translated to what direction its pointing to on the sprite sheet
    getKeyFrame() {

//        if (this.isLeft) {
//            this.previousY = this.leftY;
//            return this.leftY;
//        }
//        if (this.isRight) {
//            this.previousY = this.rightY;
//            return this.rightY;
//        }
//        if (this.isUp) {
//            this.previousY = this.upY;
//            return this.upY;
//        }
//        if (this.isDown) {
//            this.previousY = this.downY;
//            return this.downY;
//        }
//        return this.previousY;
    	
    	return 0;
    }

    update(dt) {
        // scaling dt with velocity
        //let velocity_average = (Math.abs(this.body.velocity[0]) + Math.abs(this.body.velocity[1])) > 1 ? (Math.abs(this.body.velocity[0]) + Math.abs(this.body.velocity[1])) : 1;
        //this.dt = 250 / velocity_average < this.dt_max ? this.dt_max : 300 / velocity_average;

        this.dt_count = (dt || 1/60) + (this.dt_count || 0);
        // if we've passed our delta time, reset the counter and keep going
        if(this.dt_count >= this.dt) {
            this.cf++;
            this.dt_count = 0;
        }
        if (this.cf >= this.maxcf) {
            this.cf = 0;
        } else if (!this.isLeft && !this.isUp && !this.isDown && !this.isRight) {
            this.cf = 0;
        }


        // if left and not over max velocity
        if (this.isLeft && Math.abs(this.body.velocity[0]) < this.velocity_max) {

            if(this.velocity[0] > -this.velocity_start) {
                this.setXVelocity(-this.velocity_start);
            }
            this.body.velocity[0] -= this.velocity_spd;
        }
        if (!this.isLeft && this.body.velocity[0] < 0) {
            this.body.velocity[0] /= this.velocity_decay;
        }

        if (this.isRight && this.body.velocity[0] < this.velocity_max) {

            if(this.velocity[0] < this.velocity_start) {
                this.setXVelocity(this.velocity_start);
            }

            this.body.velocity[0] += this.velocity_spd;
        }
        if (!this.isRight && this.body.velocity[0] > 0) {
            this.body.velocity[0] /= this.velocity_decay;
        }

        if (this.isDown && this.body.velocity[1] < this.velocity_max) {
            if(this.velocity[1] < this.velocity_start) {
                this.setYVelocity(this.velocity_start);
            }

            this.body.velocity[1] += this.velocity_spd;
        }
        if (!this.isDown && this.body.velocity[1] > 0) {
            this.body.velocity[1] /= this.velocity_decay;
        }

        if (this.isUp && Math.abs(this.body.velocity[1]) < this.velocity_max) {
            if(this.velocity[1] > -this.velocity_start) {
                this.setYVelocity(-this.velocity_start);
            }
            this.body.velocity[1] -= this.velocity_spd;
        }
        if (!this.isUp && this.body.velocity[1] < 0) {
            this.body.velocity[1] /= this.velocity_decay;
        }
        
        if(this.shotCooldown > 0) {
        	this.shotCooldown--;
        } else {
        	this.shotCooldown = 0;
        }
        
    }

    draw() {
        ctx_player.drawImage(this.img, this.spr_width * this.cf, this.getKeyFrame(), this.spr_width, this.spr_height,
                this.x - Camera.x, this.y - Camera.y, this.getWidth(), this.getHeight());
    }
    
    drawBoundingBox() {
        Renderer.drawShapeBoundingBox(ctx, this.shape, this.centerX, this.centerY, this.getWidth(), this.getHeight());
    }
    
    /** 
     * shoot at a given x and y coordinate
     */
    shoot(x, y) {
    	this.projectile = new Projectile(x, y, this.bullet_spd);
    	audio.playSound("shot");
    	
    }
    
    
    get velocity() {
        return this.body.velocity;
    }

    setYVelocity(v) {
        this.velocity[1] = v;
    }

    setXVelocity(v) {
        this.velocity[0] = v;
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
    
    getWidth() {
        return this.shape.width;
    }

    getHeight() {
        return this.shape.height;
    }

    setWidth(w) {
        this.shape.width = w;
    }
    setHeight(h) {
        this.shape.height = h;
    }
}