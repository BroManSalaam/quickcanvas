class Game {

    constructor(width, height) {

        this.assetmanager = new AssetManager();

        this.screen_width = width;
        this.screen_height = height;

        this.enemy_melee = [];
        this.hostages = [];
        this.buttons = [];
        this.projectiles = [];
                
        // this.buttons.push(new Button(0, 0, 200, 200, function () {
        //     console.log('clicked1!');
        // }));

        // this.buttons.push(new Button(500, 500, 200, 200, function () {
        //     console.log('clicked2!');
        // }));
        
        this.clickX = null;
        this.clickY = null;
                
        this.enemy_melee.push(new MeleeEnemy(-600, -200, 30));
        this.enemy_melee.push(new MeleeEnemy(-300, -800, 30));
        this.enemy_melee.push(new MeleeEnemy(600, 300, 30));
        this.enemy_melee.push(new MeleeEnemy(-500, 400, 30));
        
        this.hostages.push(new Hostage(-64, 0, 30, player));
        
        this.world = new p2.World({
            gravity: [0, 0]
        });

        this.world.on("beginContact", (evt) => {
            
        	let objA = evt.shapeA;
        	let objB = evt.shapeB;
        	
        	if((objA.collisionGroup == Constants.groups.GROUP_BULLET) || (objB.collisionGroup == Constants.groups.GROUP_BULLET)) {
        		//console.log("bullet collide");
        	}
        	
        	if(objA.collisionGroup == Constants.groups.GROUP_BULLET) {
        		// At this point, we know objA is the bullet
        		
        		if(objB.collisionGroup == Constants.groups.GROUP_ENEMY) {
        			// console.log(this.enemy_melee);
        			for(let i = 0; i < this.enemy_melee.length; i++) {
        				if(this.enemy_melee[i].body.id == objA.id) {
        					this.enemy_melee[i].hp -= player.atk;
        					console.log(this.enemy_melee[i].hp);
        				}
        			}
        		}
        	} else if(objB.collisionGroup == Constants.groups.GROUP_BULLET) {
        		// objB is the bullet
        		
        		if(objA.collisionGroup == Constants.groups.GROUP_ENEMY) {
        			for(let i = 0; i < this.enemy_melee.length; i++) {
        				
        				if(this.enemy_melee[i].body.id == objB.id) {
        					this.enemy_melee[i].hp -= player.atk;
        					console.log(this.enemy_melee[i].hp);
        					break;
        				}
        			}
        		}
        	}
        });

        this.states = Object.freeze({
            PLAYING: 0,
            MENU: 1
        });

        this.isPlaying = false;
        this.timeStep = 1 / 60;
    }

    init() {
        this.assetmanager.loadAssets();
        this.generateMap();
        this.addBodies();
        
        this.dt = Date.now(); // Starting values
        this.render_previous = Date.now();
        
        //ctx_player.rotate(12*Math.PI/180);
        //ctx_player.translate(-this.screen_width / 4, -this.screen_height / 4);
    }

    start() {
        this.init();

        // wait for required resources to load before launching
        this.load = setInterval(() => {

            if (this.isReady()) {
                this.isPlaying = true;
                clearInterval(this.load);

                bindInputHandler();

                this.currentstate = this.states.PLAYING;

                // arrow function, so "this" is not occupied by the interval function and is in the hands of the game class
                window.requestAnimationFrame(() => {
                    this.update();
                });
            }
        }, 50);
    }

    update() {
    	
        // delta time
        this.dt = Date.now() - this.render_previous;
        this.render_previous = Date.now();
    	        
        // playing
        if (this.currentstate == this.states.PLAYING) {

            this.world.step(this.timeStep);
            
            player.update(this.dt);
            
            ctx_player.drawImage(player.img, 0, 0, 100, 100, 100, 100, 100, 100);
            
            for (let i = 0; i < this.enemy_melee.length; i++) {
            	
            	if(this.enemy_melee[i].hp <= 0) {
            		this.enemy_melee[i].splice(i, 1);
            	} else {
            		this.enemy_melee[i].update(this.dt);            		
            	}
            	
            }
                        
            for(let h = 0; h < this.hostages.length; h++) {
            	
            	if(this.hostages[h].isDead) {
            		this.hostages.splice(h, 1);
            	} else {
            		this.hostages[h].update(this.dt);
            	}
            	
            }
            
            for(let i = 0; i < this.projectiles.length; i++) {
            	
            	if(this.projectiles[i].finished) {
            		this.world.removeBody(this.projectiles[i]);
            		this.projectiles[i].velocity[0] = 0;
            		this.projectiles[i].velocity[1] = 0;
            		this.projectiles.splice(i, 1);
            		//console.log("Removed bullet (" + this.projectiles.length + ")");
            	} else {
            		this.projectiles[i].update();            		
            	}
            }
            
            // check if we haven't added the player's bullet yet
            if(!player.bullet_isAdded) {
            	this.projectiles.push(player.projectile);
            	this.world.addBody(player.projectile.body);
            	player.bullet_isAdded = true;
            }
            
            Camera.move(player.x - this.screen_width / 2 + player.getWidth() / 2, player.y - this.screen_height / 2 + player.getHeight() / 2);
            
            //audio.pauseMusic("heman"); // "Theme song"
            
            this.render();

            if (this.isPlaying) {
                window.requestAnimationFrame(() => {
                    this.update();
                });
            }
        }
    }

    render() {
    	
        Game.clearScreen();
        
        //ctx_player.drawImage(player.);
       
        // Map
        for (let r = 0; r < this.map.length; r++) {
            for (let c = 0; c < this.map[r].length; c++) {
                if (this.map[r][c] == undefined) {
                    continue;
                }

                if (this.map[r][c] instanceof AnimatedTerrain) {
                    this.map[r][c].update(this.dt);
                }
                
                this.map[r][c].draw();
            }

        }
        
        // Hostages
        for(let h = 0; h < this.hostages.length; h++) {
        	this.hostages[h].draw();
        	this.hostages[h].drawBoundingBox();
        }
        
        // Enemies
        for (let i = 0; i < this.enemy_melee.length; i++) {
            this.enemy_melee[i].draw();
            this.enemy_melee[i].drawBoundingBox();
        }
        
        // Projectiles
        for(let i = 0; i < this.projectiles.length; i++) {
        	this.projectiles[i].draw();
        }
        
        player.draw();
        player.drawBoundingBox();

        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].draw();
            // butt-ons forever
        }
        
        // Draw all of the world bodies
//        for(let b = 0; b < this.world.bodies.length; b++) {
//        	let currentBody = this.world.bodies[b];
//        	Renderer.rect(currentBody.position[0], currentBody.position[1], currentBody.shapes[0].width, currentBody.shapes[0].height);
//        }
        
        this.render_end = Date.now();
    }

    static clearScreen() {
        ctx.clearRect(0, 0, canvas.width * 2, canvas.height * 2);
        ctx_player.clearRect(0, 0, canvas_player.width, canvas_player.height *2);
    }

    isReady() {

        if (this.assetmanager.isLoaded) {
            return true;
        }
    }

    addBodies() {

        this.world.addBody(player.body);

        // add walls    
        for (let r = 0; r < this.map.length; r++) {
            for (let c = 0; c < this.map[r].length; c++) {

                if (this.map[r][c] == undefined) {
                    continue;
                }

                // check for spawn block
                if (this.map[r][c].key == KeyConstants.SPAWN) {
                    //console.log('player spawn set to ' + this.map[r][c].x + ' ' + this.map[r][c].x);
                    player.setX(this.map[r][c].x);
                    player.setY(this.map[r][c].y);
                }

                if (this.map[r][c] instanceof Wall) {
                    this.world.addBody(this.map[r][c].body);
                }
            }
        }
        
        for(let h = 0; h < this.hostages.length; h++) {
        	this.world.addBody(this.hostages[h].body);
        }
        
        // Enemies
        for (let i = 0; i < this.enemy_melee.length; i++) {
            this.world.addBody(this.enemy_melee[i].body);
        }
        
    }

    generateMap() {

        /*
        Key constants for referance

        let KeyConstants = {
            EMPTY : 0,
            SPAWN : 1,
            TERRAIN : 2,
            WALL : 3
        };
        */

        // original map that will be converted to terrain and walls though the map generator
        let mapLayout = [
            [1, 2, 2, 2, 3, 3, 3, 3],
            [1, 2, 2, 4, 2, 4, 2, 3],
            [1, 20, 4, 5, 2, 2, 2, 2],
            [3, 2, 2, 6, 1, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2, 3],
            [2, 2, 4, 2, 2, 2, 4, 3],
            [3, 3, 3, 3, 3, 2, 2, 3]
        ];

        let chunk = [
            [4, 4, 4],
            [4, 4, 4],
            [4, 4, 4]
        ];

        this.map = MapGenerator.generate(mapLayout);

        console.log(this.map);
    }

    setClick(x, y) {
        this.clickX = x;
        this.clickY = y;
        
        if(this.buttons.length > 0) {
            for (let i = 0; i < this.buttons.length; i++) {

                if (this.isButtonClick(this.buttons[i], x, y)) {
                    this.buttons[i].click();
                    break;
                }
            }
        } else {
        	player.shoot(this.clickX, this.clickY);
        }
    }

    isButtonClick(button, x, y) {
        if (x > button.getX() && x < button.getX() + button.getWidth() && y > button.y && y < button.getY() + button.getHeight()) {
            return true;
        } else {
            return false;
        }
    }
}