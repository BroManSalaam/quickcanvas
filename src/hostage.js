
class Hostage {
	
	/**
	 * The constructor creates a hostage with the default settings
	 * at the given x and y position. 
	 */
	constructor(x, y, spd, playerObj) {
		
		this.spd = spd;
		this.player = playerObj; // Store the player for following later
		
		// Movement / velocity variables
		this.dx = 0.0;
		this.dy = 0.0;
		this.velocityMax = 100;
		this.startVelocity = 55; // The beginning velocity of the hostage
		
		this.img = new Image();
		this.animDelay = 100; // Millisecond delay in between frames
		this.elapsedTime = 0;
		this.totalFrames = 13;
		this.animState = 0; // 0 Up, 1 Right, 2 Down, 3 Left
		this.spr_width = 64;
		this.spr_height = 64;
		
		this.isFollowing = false; // Is the hostage tethered to the player?
		this.ignoreKey = false; // Asks as a de-bouncer for toggles
		this.lastPlayerPos = {x: 0, y: 0}; // Array of player's last positions
		
		this.isDead = false;
		
		this.body = new p2.Body({
			position: [x, y],
			mass: 1,
			type: p2.Body.DYNAMIC
		});
		
		this.shape = new p2.Box({
			width: 64,
			height: 64,
			collisionGroup: Constants.groups.GROUP_HOSTAGE,
			collisionMask: Constants.groups.GROUP_PLAYER | Constants.groups.GROUP_WALL | Constants.groups.GROUP_ENEMY | Constants.groups.GROUP_HOSTAGE
		});
		
		this.body.addShape(this.shape);
				
		this.load();
	}
	
	load() {
		this.img.src = "src/assets/spritesheets/spriteTemplate.png";
				
		this.img.onload = function() {
			// Do something fancy here
		};
		
	}
	
	kill() {
		
		this.dead = true;
		world.removeBody(this.body);
		
	}
	
	/**
	 * The update method should be called every game loop. This method
	 * will update the position of the hostage and the state of the
	 * variables, such as if it is following the player or if it. It takes
	 * in the delta time (the amount of time in milliseconds since the
	 * last frame)
	 */
	update(delta) {
		
		// --- Animation operations ---
		this.elapsedTime = this.elapsedTime + delta;
		
		if(this.dy < 0) {
			this.animState = 0; // Up
		} else if(this.dx > 0) {
			this.animState = 1; // Right
		} else if(this.dy > 0) {
			this.animState = 2; // Down
		} else if(this.dx < 0) {
			this.animState = 3; // Left
		} else if(!this.isFollowing) {
			this.animState = 4; // Idle / lost
		}
		
		// --- Following mechanics ---
		// If the player pressed the "e" key
		if((player.shouldFollow) && (!this.ignoreKey)) {
			
			// If it's isFollowing is true, set to false (and vice versa)
			if(!this.isFollowing) {
				
				// If the hostage is within the follow radius
				if((this.x < player.x + Constants.hostage.FOLLOW_RADIUS) && (this.x > player.x - Constants.hostage.FOLLOW_RADIUS) &&
						(this.y < player.y + Constants.hostage.FOLLOW_RADIUS) && (this.y > player.y - Constants.hostage.FOLLOW_RADIUS)) {
					this.isFollowing = true;
				}
			} else { // If e isn't pressed, stop following
				this.isFollowing = false;
			}
			this.ignoreKey = true;
		} else if((!player.shouldFollow) && (this.ignoreKey)) {
			this.ignoreKey = false;
		}
		
		// If the hostages should be following
		if(this.isFollowing) {
			
			// X
			if(this.x > player.x + Constants.hostage.FOLLOW_RADIUS) {
				this.dx = -1;
			} else if(this.x < player.x - Constants.hostage.FOLLOW_RADIUS) {
				this.dx = 1;
			} else {
				this.dx = 0;
			}
			
			// Y
			if(this.y > player.y + Constants.hostage.FOLLOW_RADIUS) {
				this.dy = -1;
			} else if(this.y < player.y - Constants.hostage.FOLLOW_RADIUS) {
				this.dy = 1;
			} else {
				this.dy = 0;
			}
			
//			let playerPos = {x: player.x, y: player.y}
//			let lastPos = this.lastPlayerPos[0];
//			let targetPos;
//			
//			// Check for undefined
//			if(lastPos == undefined) {
//				lastPos = {x: 0, y: 0}; // Dummy values
//			}
//			
//			// Don't add the same player position twice
//			if((lastPos.x != playerPos.x) || (lastPos.y != playerPos.y)) {
//				this.lastPlayerPos.unshift(playerPos);
//			}
//			
//			// If there is a stored player position
//			if(this.lastPlayerPos.length > 1) {
//				
//				// Where the hostage should go (the oldest saved position)
//				targetPos = this.lastPlayerPos[this.lastPlayerPos.length - 1];
//				
//				// X
//				if(this.x < targetPos.x) {
//					this.dx = 1;
//				} else if(this.x > targetPos.x) {
//					this.dx = -1;
//				} else {
//					this.dx = 0;
//				}
//				
//				// Y
//				if(this.y > targetPos.y) {
//					this.dy = -1;
//				} else if(this.y < targetPos.y) {
//					this.dy = 1;
//				} else {
//					this.dy = 0;
//				}
//				
//				// If the player is close enough to the goal?
//				if((this.x < targetPos.x + Constants.hostage.FINISH_RADIUS) && (this.x > targetPos.x - Constants.hostage.FINISH_RADIUS) &&
//						(this.y < targetPos.y + Constants.hostage.FINISH_RADIUS) && (this.y > targetPos.y - Constants.hostage.FINISH_RADIUS)) {
//					
//					this.lastPlayerPos.pop(); // Remove the last (oldest) position
//					this.dx = 0;
//					this.dy = 0;
//					console.log("Reached " + this.lastPlayerPos.length);
//				}
//				
//			} else {
//				this.dx = 0;
//				this.dy = 0;
//			}
						
		} else {
			this.dx = 0;
			this.dy = 0;
		}
		
		
		// --- Movement / velocity operations ---
		// X
		if(Math.abs(this.velocityX) < this.velocityMax) {
			this.setVelocityX(this.velocityMax * this.dx);
		}
		if(this.dx == 0) {
			this.setVelocityX(0);
		}
		
		// Y
		if(Math.abs(this.velocityY) < this.velocityMax) {
			this.setVelocityY(this.velocityMax * this.dy);
		}
		if(this.dy == 0) {
			this.setVelocityY(0);
		}
		
	}
	
	draw(){
		
		if(this.img.complete) {
			
			if(this.elapsedTime >= (this.animDelay * this.totalFrames)) {
				this.elapsedTime = 0;
			}
			
			Renderer.drawBoxImage(this.img, this.shape, Math.floor(this.elapsedTime / this.animDelay) * this.spr_width, this.animState * this.spr_height, 64, 64, this.x, this.y, this.width, this.height);
			//Renderer.drawRotateImage(this.img, this.shape, 0, 0, 64, 64, this.x, this.y, this.width, this.height, 90);
		} else {
			console.log("Sprite for hostage not yet loaded! ");
		}
		
	}
	
	drawBoundingBox() {
		Renderer.drawShapeBoundingBox(this.shape, this.centerX, this.centerY, this.shape.width, this.shape.height);
	}
	
	// Get / Set methods
	
	get x() {
		return this.body.position[0];
	}
	get y() {
		return this.body.position[1];
	}
	
	get centerX() {
		return this.x + (this.width / 2);
	}
	get centerY() {
		return this.y + (this.height / 2);
	}
	
	get width() {
		return this.shape.width
	}
	get height() {
		return this.shape.height;
	}
	
	get velocityX() {
		return this.body.velocity[0];
	}
	setVelocityX(vx) {
		this.body.velocity[0] = vx;
	}
	
	get velocityY() {
		return this.body.velocity[1];
	}
	setVelocityY(vy) {
		this.body.velocity[1] = vy;
	}
	
	getIsDead() {
		return this.isDead;
	}
	setIsDead(newDead) {
		this.dead = newDead;
	}
	
}