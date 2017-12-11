
class Projectile {

	/**
	 * 
	 * @param {Number} x
	 * @param {Number} y 
	 * @param {Number} width 
	 * @param {Number} height 
	 * @param {Number} spd 
	 * @param {Number} angle 
	 * @param {Number} offset 
	 * @param {Number} xvelocity 
	 * @param {Number} yvelocity
	 * 
	 * @description construct a new projectile with the given parameters
	 *  
	 */
	constructor(x, y, width, height, spd, angle, offset, xvelocity, yvelocity) {

		this.finished = false;

		this.body = new p2.Body({
			position: [x + Math.cos(angle) + width, y + Math.sin(angle) + height],
			mass: 1,
			type: p2.Body.DYNAMIC,
			velocity: [ // initial velocity in ship direction
				spd * Math.cos((angle - offset) * (Math.PI / 180)) + xvelocity,
				spd * Math.sin((angle - offset) * (Math.PI / 180)) + yvelocity
			],
		});
		
		//console.log(Math.cos(player.rotation));

		this.shape = new p2.Box({
			width: width,
			height: height,
			collisionGroup: Constants.groups.GROUP_BULLET,
			collisionMask: Constants.groups.GROUP_WALL | Constants.groups.GROUP_ENEMY | Constants.groups.GROUP_HOSTAGE
		});

		this.body.addShape(this.shape);
	}

	update() {
		// we reach our destination
		if (this.x > player.x + game.screen_width / 2 || this.x < player.x - game.screen_width / 2 || this.y > player.y + game.screen_height || this.y < player.y - game.screen_height) {
			this.finished = true;
		}
	}

	draw() {
		//Renderer.drawShapeBoundingBox(this.shape, this.x + Camera.x, this.y + Camera.y, this.width, this.height);
		ctx.fillStyle = "#FFFF00";
		Renderer.fillRect(this.x, this.y, this.width, this.height);
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