/**
 * http://usejsdoc.org/
 */


class Projectile {
	
	constructor(x, y, spd) {
		
		// The destination coordinates
		this.dx = x + Camera.x;
		this.dy = y + Camera.y;
				
		this.finished = false;
		
		this.spd = spd;
		
        this.body = new p2.Body({
            position: [player.x, player.y],
            mass: 10,
            type: p2.Body.DYNAMIC,
            velocity: [1233, 1233],
        });
        
        this.shape = new p2.Box({
            width: 24,
            height: 24,
            collisionGroup: Constants.groups.GROUP_BULLET,
            collisionMask: Constants.groups.GROUP_WALL | Constants.groups.GROUP_ENEMY | Constants.groups.GROUP_HOSTAGE
        });

        this.body.addShape(this.shape);
	}
	
	update() {
		// we reach our destination
		// TODO: thissss
		if(this.x < this.dx + Constants.bullet.FINISH_RADIUS && this.x > this.dx - Constants.bullet.FINISH_RADIUS &&
				this.y < this.dy + Constants.bullet.FINISH_RADIUS && this.y > this.dy - Constants.bullet.FINISH_RADIUS) {
			this.finished = true;
			//console.log("bullet expire - destination");
		}
		
		if(Math.abs(this.velocity[0]) < Constants.bullet.SPEED_MINIMUM || Math.abs(this.velocity[1]) < Constants.bullet.SPEED_MINIMUM) {
			this.finished = true;
			//console.log("bullet expire - velocity");
		}
		
		if(this.x < this.dx) {
			this.setXVelocity(this.spd);
		} 
		if(this.y < this.dy) {
			this.setYVelocity(this.spd);
		} 
		if(this.x > this.dx) {
			this.setXVelocity(-this.spd);
		} 
		if(this.y > this.dy) {
			this.setYVelocity(-this.spd);
		}
		
	}
	
	draw() {
        //Renderer.drawShapeBoundingBox(this.shape, this.x + Camera.x, this.y + Camera.y, this.width, this.height);
        Renderer.drawShapeBoundingBox(this.shape, this.x + 32, this.y + 32, this.width, this.height);
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

    setWidth(w) {
        this.shape.width = w;
    }
    setHeight(h) {
        this.shape.height = h;
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
}