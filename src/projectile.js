
class Projectile {

	constructor(spd) {

		this.finished = false;

		this.spd = spd;
		
		let angle = player.rotation;

		this.body = new p2.Body({
			position: [player.x + Math.cos(angle) + 24, player.y + Math.sin(angle) + 24],
			mass: 10,
			type: p2.Body.DYNAMIC,
			velocity: [ // initial velocity in ship direction
				this.spd * Math.cos((angle - 90) * (Math.PI / 180)) + player.velocity[0],
				this.spd * Math.sin((angle - 90) * (Math.PI / 180)) + player.velocity[1]
			],
		});
		
		//console.log(Math.cos(player.rotation));

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