class Game {

    constructor(width, height) {

        this.assetmanager = new AssetManager();

        this.screen_width = width;
        this.screen_height = height;

        // how far it is from one corner to the opposite side
        this.diagonal_length = Math.sqrt(Math.pow(this.screen_width, 2) + Math.pow(this.screen_height, 2))

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


        this.mouseX = null;
        this.mouseY = null;

        this.mouseX_previous = null;
        this.mouseY_previous = null;

        this.clickX = null;
        this.clickY = null;

        this.enemy_melee.push(new MeleeEnemy(200, 200, 30));
        this.enemy_melee.push(new MeleeEnemy(-300, 800, 30));
        this.enemy_melee.push(new MeleeEnemy(500, 300, 30));
        this.enemy_melee.push(new MeleeEnemy(-500, 400, 30));

        this.hostages.push(new Hostage(-64, 0, 30, player));

        this.world = new p2.World({
            gravity: [0, 0]
        });

        this.world.on("beginContact", (evt) => {

            let objA = evt.shapeA;
            let objB = evt.shapeB;

            if (objA.collisionGroup == Constants.groups.GROUP_BULLET) {

                // remove bullet
                for (let i = 0; i < this.projectiles.length; i++) {
                    if (objA.id == this.projectiles[i].shape.id) {
                        this.projectiles.splice(i, 1);
                    }
                }

                if (objB.collisionGroup == Constants.groups.GROUP_ENEMY) {

                    for (let i = 0; i < this.enemy_melee.length; i++) {
                        if (this.enemy_melee[i].shape.id == objB.id) {
                            this.enemy_melee[i].hp -= player.atk;
                            break;
                        }
                    }
                }
            } else if (objB.collisionGroup == Constants.groups.GROUP_BULLET) {

                // remove bullet
                for (let i = 0; i < this.projectiles.length; i++) {
                    if (objB.id == this.projectiles[i].shape.id) {
                        this.projectiles.splice(i, 1);
                    }
                }

                if (objA.collisionGroup == Constants.groups.GROUP_ENEMY) {

                    for (let i = 0; i < this.enemy_melee.length; i++) {
                        if (this.enemy_melee[i].shape.id == objA.id) {
                            this.enemy_melee[i].hp -= player.atk;
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

        this.dt = Date.now(); // Starting values
        this.render_previous = Date.now();
    }

    start() {
        this.init();

        // wait for required resources to load before launching
        this.load = setInterval(() => {

            if (this.isReady()) {
                this.isPlaying = true;
                clearInterval(this.load);

                this.generateMap();
                this.addBodies();
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

            this.updatePlayer();
            this.updateEnemies();
            this.updateHostages()
            this.updateProjectiles();

            // set cam position to player position plus half screen width and player size, this doesn't change the player's x, just moves position on screen
            Camera.move(player.x - this.screen_width / 2 + player.getWidth() / 2, player.y - this.screen_height / 2 + player.getHeight() / 2);

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

        this.drawMap();
        this.drawHostages();
        this.drawEnemies();
        this.drawProjectiles();

        player.draw();
        player.drawBoundingBox();

        this.render_end = Date.now();
    }

    static clearScreen() {
        ctx.clearRect(0, 0, canvas.width * 2, canvas.height * 2);
        ctx_player.clearRect(0, 0, canvas_player.width, canvas_player.height * 2);
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

                if (this.map[r][c] === undefined) {
                    continue;
                }

                // check for spawn block
                if (this.map[r][c].key == KeyConstants.types.SPAWN) {
                    player.setX(this.map[r][c].x);
                    player.setY(this.map[r][c].y);
                }

                //console.log(this.map[r][c]);

                if (this.map[r][c] instanceof Wall) {
                    console.log('added ' + r + ' ' + c);
                    this.world.addBody(this.map[r][c].body);
                }
            }
        }

        for (let h = 0; h < this.hostages.length; h++) {
            this.world.addBody(this.hostages[h].body);
        }

        // Enemies
        for (let i = 0; i < this.enemy_melee.length; i++) {
            this.world.addBody(this.enemy_melee[i].body);
        }

    }

    generateMap() {

        // original map that will be converted to terrain and walls though the map generator
        let mapLayout = [
            [6, 6, 7, 5, 4, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,],
        ];

        let chunk = [
            [4, 4, 4],
            [4, 4, 4],
            [4, 4, 4]
        ];

        this.map = MapGenerator.generate(mapLayout);
    }

    setClick(x, y) {

        this.clickX = x;
        this.clickY = y;

        if (this.buttons.length > 0) {
            for (let i = 0; i < this.buttons.length; i++) {

                if (this.isButtonClick(this.buttons[i], x, y)) {
                    this.buttons[i].click();
                    break;
                }
            }
        } else {
            player.shoot();
        }
    }

    setMouseLocation(x, y) {

        this.mouseX_previous = this.mouseX;
        this.mouseY_previous = this.mouseY;

        this.mouseX = x;
        this.mouseY = y;
    }

    isButtonClick(button, x, y) {
        if (x > button.getX() && x < button.getX() + button.getWidth() && y > button.y && y < button.getY() + button.getHeight()) {
            return true;
        } else {
            return false;
        }
    }

    updateEnemies() {
        for (let i = 0; i < this.enemy_melee.length; i++) {
            if (this.enemy_melee[i].hp <= 0) {
                this.world.removeBody(this.enemy_melee[i]);
                this.enemy_melee.splice(i, 1);
            } else {
                this.enemy_melee[i].update(this.dt);
            }
        }
    }

    updateProjectiles() {
        for (let i = 0; i < this.projectiles.length; i++) {

            if (this.projectiles[i].finished) {
                this.world.removeBody(this.projectiles[i]);
                this.projectiles[i].velocity[0] = 0;
                this.projectiles[i].velocity[1] = 0;
                this.projectiles.splice(i, 1);
                //console.log("Removed bullet (" + this.projectiles.length + ")");
            } else {
                this.projectiles[i].update();
            }
        }
    }

    updateHostages() {
        for (let h = 0; h < this.hostages.length; h++) {

            if (this.hostages[h].isDead) {
                this.hostages.splice(h, 1);
            } else {
                this.hostages[h].update(this.dt);
            }
        }
    }

    updatePlayer() {
        player.rotateToMouse(this.mouseX, this.mouseY);
        player.update(this.dt);

        // check if we haven't added the player's bullet yet
        if (!player.bullet_isAdded) {
            this.projectiles.push(player.projectile);
            this.world.addBody(player.projectile.body);
            player.bullet_isAdded = true;
        }
    }

    drawEnemies() {
        for (let i = 0; i < this.enemy_melee.length; i++) {
            this.enemy_melee[i].draw();
            this.enemy_melee[i].drawBoundingBox();
        }
    }

    drawHostages() {
        for (let h = 0; h < this.hostages.length; h++) {
            this.hostages[h].draw();
            this.hostages[h].drawBoundingBox();
        }
    }

    drawProjectiles() {
        for (let i = 0; i < this.projectiles.length; i++) {
            this.projectiles[i].draw();
        }
    }

    drawMap() {
        for (let r = 0; r < this.map.length; r++) {
            for (let c = 0; c < this.map[r].length; c++) {
                if (this.map[r][c] === undefined) {
                    continue;
                }

                if (this.map[r][c] instanceof AnimatedTerrain) {
                    this.map[r][c].update(this.dt);
                }

                this.map[r][c].draw();
            }

        }
    }

    drawButtons() {
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].draw();
            // butt-ons forever
        }
    }

    drawBodies() {
        // Draw all of the world bodies
        for (let b = 0; b < this.world.bodies.length; b++) {
            let currentBody = this.world.bodies[b];
            Renderer.rect(currentBody.position[0], currentBody.position[1], currentBody.shapes[0].width, currentBody.shapes[0].height);
        }
    }
}