class Game {

    constructor(width, height) {

        this.assetmanager = new AssetManager();

        this.screen_width = width;
        this.screen_height = height;

        this.enemy_melee = [];
        this.buttons = [];

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
        this.enemy_melee.push(new MeleeEnemy(900, -300, 30));
        this.enemy_melee.push(new MeleeEnemy(-500, 400, 30));

        this.world = new p2.World({
            gravity: [0, 0]
        });

        this.world.on("beginContact", function (evt) {
            
            //check collision by gorup
            if(evt.shapeA.collisionGroup == Constants.groups.GROUP_PLAYER && evt.shapeB.collisionGroup == Constants.groups.GROUP_WALL) {
                console.log("player");
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

        // playing
        if (this.currentstate == this.states.PLAYING) {

            this.world.step(this.timeStep);

            player.update(this.dt);

            for (let i = 0; i < this.enemy_melee.length; i++) {
                this.enemy_melee[i].update(this.dt);
            }

            Camera.move(player.x - this.screen_width / 2 + player.getWidth() / 2, player.y - this.screen_height / 2 + player.getHeight() / 2);

            if (player.x > 400) {
                audio.pauseMusic("heman");
            } else {
                audio.playMusic("heman");
            }

            this.render();

            if (this.isPlaying) {
                window.requestAnimationFrame(() => {
                    this.update();
                });
            }
        }
    }

    render() {
        // delta time
        this.dt = Date.now() - this.render_previous;
        this.render_previous = Date.now();

        Game.clearScreen();

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
        player.draw();
        player.drawBoundingBox();

        for (let i = 0; i < this.enemy_melee.length; i++) {
            this.enemy_melee[i].draw();
            this.enemy_melee[i].drawBoundingBox();
        }

        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].draw();
        }

        this.render_end = Date.now();
    }

    static clearScreen() {
        ctx.clearRect(0, 0, canvas.width * 2, canvas.height * 2);
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
            [3, 3, 3, 3, 3, 3, 3, 3],
            [3, 2, 2, 2, 2, 4, 2, 3],
            [3, 2, 4, 2, 2, 2, 2, 2],
            [3, 2, 2, 2, 1, 2, 2, 2],
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
    }

    setClick(x, y) {
        this.clickX = x;
        this.clickY = y;

        for (let i = 0; i < this.buttons.length; i++) {

            if (this.isButtonClick(this.buttons[i], x, y)) {
                this.buttons[i].click();
            }
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