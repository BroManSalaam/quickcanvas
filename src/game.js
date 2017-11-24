class Game {

    constructor(width, height) {
        this.screen_width = width;
        this.screen_height = height;

        this.enemy_melee = [];
        this.walls = [];

        // original map that will be converted to terrain and walls though the map generator
        let mapLayout = [
            [2, 2, 2, 2],
            [2, 1, 2, 2],
            [1, 1, 2, 2],
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 1],
        ];

        let chunk = [
            [0, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 0, 1],
            [1, 1, 1, 1],
        ];

        //MapGenerator.pushChunk(mapLayout, chunk, 0);
        MapGenerator.appendChunk(mapLayout, chunk, 0);

        this.map = MapGenerator.generate(mapLayout);

        this.enemy_melee.push(new MeleeEnemy(-600, -200, 2));
        this.enemy_melee.push(new MeleeEnemy(-300, -800, 2));
        this.enemy_melee.push(new MeleeEnemy(900, -300, 2.5));
        this.enemy_melee.push(new MeleeEnemy(-500, 400, 2.5));

        this.world = new p2.World({
            gravity: [0, 0]
        });

        this.world.on("beginContact", function (evt) {
        	
        	if(evt.shapeA instanceof Terrain) {
        		
        	}
        });

        this.isPlaying = false;
        this.timeStep = 1 / 60;
    }

    init() {
        MEC.init();

        this.addBodies();
    }

    start() {
        this.init();

        // wait for required resources to load before launching
        this.load = setInterval(() => {

            if (Game.isReady()) {
                this.isPlaying = true;
                clearInterval(this.load);

                bindInputHandler();

                // arrow function, so "this" is not occupied by the interval function and is in the hands of the game class
                window.requestAnimationFrame(() => {
                    this.update();
                });
            }
        }, 50);
    }

    update() {
        this.world.step(this.timeStep);

        player.update();

        for (let i = 0; i < this.enemy_melee.length; i++) {
            //this.enemy_melee[i].update();
        }

        Camera.move(player.x - this.screen_width / 2 + player.getWidth() / 2, player.y - this.screen_height / 2 + player.getHeight() / 2);
        
        if(player.x > 400) {
        	audio.pauseMusic("menu");
        } else {
        	audio.playMusic("menu");
        }
        
        this.render(this.render_end - this.render_start);

        if (this.isPlaying) {
            window.requestAnimationFrame(() => {
                this.update();
            });
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
                
                this.map[r][c].draw();
            }

        }
        player.draw(this.dt);
        player.drawBoundingBox();

        Renderer.fillText("(0, 0)", 0, 0, 100);

        for (let i = 0; i < this.enemy_melee.length; i++) {
            this.enemy_melee[i].draw();
            this.enemy_melee[i].drawBoundingBox();
        }

        for (let i = 0; i < this.walls.length; i++) {
            this.walls[i].draw();
        }



        this.render_end = Date.now();
    }

    static clearScreen() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    static isReady() {

        if (JSON.stringify(MEC.isloaded) && player.isLoaded) {
            return true;
        }
    }

    addBodies() {

        this.world.addBody(player.body);

        // add walls    
        for (let r = 0; r < this.map.length; r++) {
            for (let c = 0; c < this.map[r].length; c++) {

                if(this.map[r][c] == undefined) {
                    continue;
                }

                // check for spawn block
                if (this.map[r][c].key == 0) {
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
}