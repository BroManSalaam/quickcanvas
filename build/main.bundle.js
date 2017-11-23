'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AudioManager = function AudioManager() {
    _classCallCheck(this, AudioManager);

    // effects or quick noises
    this.sounds = {};

    // game music
    this.music = {

        menu: new Audio('src/assets/audio/menu.mp3')
    };
};
"use strict";

var Camera = {

    zoom: .07,
    x: 0,
    y: 0,

    move: function move(x, y) {
        Camera.x = x;
        Camera.y = y;
    },

    translate: function translate(xd, yd) {
        Camera.x += xd;
        Camera.y += yd;
    }
};

/**
 * to draw
 *  object.x - Camera.x
 *  object.y - Camera.y
 * 
 * this moves everything drawn onto the canvas back according on the camera position
 * this works for negative coordinates as well
 * 
 */
"use strict";

var Constants = {

    GROUP_PLAYER: 1,
    GROUP_WALL: 2,
    GROUP_ENEMY: 4
};
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
    function Game(width, height) {
        _classCallCheck(this, Game);

        this.screen_width = width;
        this.screen_height = height;

        this.enemy_melee = [];

        this.walls = [];

        this.enemy_melee.push(new MeleeEnemy(-600, -200, 2));
        this.enemy_melee.push(new MeleeEnemy(-300, -800, 2));
        this.enemy_melee.push(new MeleeEnemy(900, -300, 2.5));
        this.enemy_melee.push(new MeleeEnemy(-500, 400, 2.5));

        this.world = new p2.World({
            gravity: [0, 0]
        });

        this.world.on("beginContact", function (evt) {});

        this.isPlaying = false;
        this.timeStep = 1 / 60;
    }

    _createClass(Game, [{
        key: "init",
        value: function init() {
            MEC.init();

            this.world.addBody(player.body);

            for (var i = 0; i < this.enemy_melee.length; i++) {
                this.world.addBody(this.enemy_melee[i].body);
            }
        }
    }, {
        key: "start",
        value: function start() {
            var _this = this;

            this.init();

            // wait for required resources to load before launching
            this.load = setInterval(function () {

                if (Game.isReady()) {
                    _this.isPlaying = true;
                    clearInterval(_this.load);

                    bindInputHandler();

                    // arrow function, so "this" is not occupied by the interval function and is in the hands of the game class
                    window.requestAnimationFrame(function () {
                        _this.update();
                    });
                }
            }, 50);
        }
    }, {
        key: "update",
        value: function update() {
            var _this2 = this;

            this.world.step(this.timeStep);

            player.update();

            for (var i = 0; i < this.enemy_melee.length; i++) {
                this.enemy_melee[i].update();
            }

            Camera.move(player.getX() - this.screen_width / 2 + player.getWidth() / 2, player.getY() - this.screen_height / 2 + player.getHeight() / 2);

            this.render(this.render_end - this.render_start);

            if (this.isPlaying) {
                window.requestAnimationFrame(function () {
                    _this2.update();
                });
            }
        }
    }, {
        key: "render",
        value: function render() {
            this.dt = Date.now() - this.render_previous;
            this.render_previous = Date.now();

            Game.clearScreen();
            player.draw(this.dt);
            player.drawBoundingBox();

            Renderer.fillText("(0, 0)", 0, 0, 100);

            for (var i = 0; i < this.enemy_melee.length; i++) {
                this.enemy_melee[i].draw();
                this.enemy_melee[i].drawBoundingBox();
            }

            this.render_end = Date.now();
        }
    }], [{
        key: "clearScreen",
        value: function clearScreen() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }, {
        key: "isReady",
        value: function isReady() {

            if (JSON.stringify(MEC.isloaded) && player.isLoaded) {
                return true;
            }
        }
    }]);

    return Game;
}();
"use strict";

function bindInputHandler() {

    document.onkeydown = function (c) {

        if (c.keyCode == 37) {
            player.isLeft = true;
        }
        if (c.keyCode == 38) {
            player.isUp = true;
        }
        if (c.keyCode == 39) {
            player.isRight = true;
        }
        if (c.keyCode == 40) {
            player.isDown = true;
        }
    };

    document.onkeyup = function (c) {

        if (c.keyCode == 37) {
            player.isLeft = false;
        }
        if (c.keyCode == 38) {
            player.isUp = false;
        }
        if (c.keyCode == 39) {
            player.isRight = false;
        }
        if (c.keyCode == 40) {
            player.isDown = false;
        }
    };
}
'use strict';

var canvas = void 0;
var ctx = void 0;
var player = void 0;
var game = void 0;
var audio = void 0;

$(document).ready(function () {
    canvas = document.getElementById('main_canvas');
    ctx = document.getElementById('main_canvas').getContext('2d');
    ctx.font = "14px Verdana";

    canvas.width = $(window).width();
    canvas.height = $(window).height();

    $("body").css("overflow", "hidden");

    audio = new AudioManager();
    audio.music.menu.play();

    game = new Game($(window).width(), $(window).height());

    player = new Player(10, 0, 1.5);

    game.start();
});
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * all entities prepended with spr_ are purely for textual purposes and have no correlation to the rendered version of the game
 * 
 * width and height depict on the size of the player in the actual world in pixels
 */
var Player = function () {
    function Player(x, y, spd) {
        _classCallCheck(this, Player);

        // position & animation

        this.spr_width = 460.25;
        this.spr_height = 592;

        this.cf = 3;
        this.maxcf = 4;

        this.dt = 100;
        this.dt_max = 75;
        this.dt_count = 0;

        // img
        this.img = new Image();
        this.img.src = "src/assets/img/SpriteSheet.png";
        this.isLoaded = false;
        this.img.onload = this.onload();

        this.isLeft = false;
        this.isRight = false;
        this.isDown = false;
        this.isUp = false;

        this.leftY = 1184;
        this.rightY = 592;
        this.downY = 0;
        this.upY = 1846;
        this.previousY = 0;

        // physics

        this.spd = spd;
        this.velocity_spd = .2;

        // maximum velocity achievable by player through normal movement
        // set this slightly lower than what you want the maximum to be due to the amount of time it takes to update from input
        this.velocity_max = 35;
        // rate at which the velocity returns to zero if the player decides to suddenly change direction
        this.velocity_decay = 2;

        this.body = new p2.Body({
            position: [x, y],
            mass: 5,
            type: p2.Body.KINEMATIC
        });

        this.shape = new p2.Box({
            width: 2342,
            height: 64,
            collisionGroup: Constants.GROUP_PLAYER,
            collisionMask: Constants.GROUP_ENEMY | Constants.GROUP_WALL
        });

        this.body.addShape(this.shape);
    }

    _createClass(Player, [{
        key: "onload",
        value: function onload() {
            console.log('player sprite loaded');
            this.isLoaded = true;
        }

        // get what direction the player is in translated to what direction its pointing to on the sprite sheet

    }, {
        key: "getKeyFrame",
        value: function getKeyFrame() {

            if (this.isLeft) {
                this.previousY = this.leftY;
                return this.leftY;
            }
            if (this.isRight) {
                this.previousY = this.rightY;
                return this.rightY;
            }
            if (this.isUp) {
                this.previousY = this.upY;
                return this.upY;
            }
            if (this.isDown) {
                this.previousY = this.downY;
                return this.downY;
            }

            return this.previousY;
        }
    }, {
        key: "update",
        value: function update() {
            // scaling dt with velocity
            var velocity_average = Math.abs(this.body.velocity[0]) + Math.abs(this.body.velocity[1]) > 1 ? Math.abs(this.body.velocity[0]) + Math.abs(this.body.velocity[1]) : 1;
            this.dt = 250 / velocity_average < this.dt_max ? this.dt_max : 300 / velocity_average;

            // if left and not over max velocity
            if (this.isLeft && Math.abs(this.body.velocity[0]) < this.velocity_max) {
                this.body.velocity[0] -= this.velocity_spd;
            }
            if (!this.isLeft && this.body.velocity[0] < 0) {
                this.body.velocity[0] /= this.velocity_decay;
            }

            if (this.isRight && this.body.velocity[0] < this.velocity_max) {
                this.body.velocity[0] += this.velocity_spd;
            }
            if (!this.isRight && this.body.velocity[0] > 0) {
                this.body.velocity[0] /= this.velocity_decay;
            }

            if (this.isDown && this.body.velocity[1] < this.velocity_max) {
                this.body.velocity[1] += this.velocity_spd;
            }
            if (!this.isDown && this.body.velocity[1] > 0) {
                this.body.velocity[1] /= this.velocity_decay;
            }

            if (this.isUp && Math.abs(this.body.velocity[1]) < this.velocity_max) {
                this.body.velocity[1] -= this.velocity_spd;
            }
            if (!this.isUp && this.body.velocity[1] < 0) {
                this.body.velocity[1] /= this.velocity_decay;
            }

            //
            if (this.isLeft) {
                this.setX(this.getX() - this.spd);
            }
            if (this.isRight) {
                this.setX(this.getX() + this.spd);
            }
            if (this.isDown) {
                this.setY(this.getY() + this.spd);
            }
            if (this.isUp) {
                this.setY(this.getY() - this.spd);
            }
        }
    }, {
        key: "draw",
        value: function draw(dt) {
            this.dt_count = (dt || 1 / 60) + (this.dt_count || 0);
            // if we've passed our delta time, reset the counter and keep going
            if (this.dt_count >= this.dt) {
                this.cf++;
                this.dt_count = 0;
            }
            if (this.cf >= this.maxcf) {
                this.cf = 0;
            } else if (!this.isLeft && !this.isUp && !this.isDown && !this.isRight) {
                this.cf = 0;
            }

            console.log(this.cf);

            Renderer.drawBoxImage(this.img, this.shape, this.spr_width * this.cf, this.getKeyFrame(), this.spr_width, this.spr_height, this.getX(), this.getY(), this.getWidth(), this.getHeight());
        }
    }, {
        key: "drawBoundingBox",
        value: function drawBoundingBox() {
            Renderer.drawShapeBoundingBox(this.shape, this.getX(), this.getY(), this.getWidth(), this.getHeight());
        }
    }, {
        key: "getX",
        value: function getX() {
            return this.body.position[0];
        }
    }, {
        key: "getY",
        value: function getY() {
            return this.body.position[1];
        }
    }, {
        key: "setX",
        value: function setX(x) {
            this.body.position[0] = x;
        }
    }, {
        key: "setY",
        value: function setY(y) {
            this.body.position[1] = y;
        }
    }, {
        key: "getWidth",
        value: function getWidth() {
            return this.shape.width;
        }
    }, {
        key: "getHeight",
        value: function getHeight() {
            return this.shape.height;
        }
    }, {
        key: "setWidth",
        value: function setWidth(w) {
            this.shape.width = w;
        }
    }, {
        key: "setHeight",
        value: function setHeight(h) {
            this.shape.height = h;
        }
    }]);

    return Player;
}();
"use strict";

var _Renderer;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * simple api for drawing to the canvas while maintaining aspect ratio and positioning with the camera
 */

var Renderer = (_Renderer = {

    /**
     * 
     * @param {*} img 
     * @param {*} sx 
     * @param {*} xy 
     * @param {*} sw 
     * @param {*} sh 
     * @param {*} dx 
     * @param {*} dy 
     * @param {*} dw 
     * @param {*} dh 
     */
    drawImage: function drawImage(img, sx, xy, sw, sh, dx, dy, dw, dh) {
        ctx.drawImage(img, sx, xy, sw, sh, dx - Camera.x, dy - Camera.y, dw * Camera.zoom, dh * Camera.zoom);
    },


    /**
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} w 
     * @param {*} h 
     */
    fillRect: function fillRect(x, y, w, h) {
        ctx.fillRect(x - Camera.x, y - Camera.y, w * Camera.zoom, h * Camera.zoom);
    },


    /**
     * 
     * @param {*} box 
     * @param {*} x 
     * @param {*} y 
     * @param {*} w 
     * @param {*} h 
     */
    fillBoxRect: function fillBoxRect(box, x, y, w, h) {
        ctx.fillRect(x - Camera.x - box.width / 2, y - Camera.y - box.height / 2, w * Camera.zoom, h * Camera.zoom);
    },


    /**
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} w 
     * @param {*} h 
     */
    rect: function rect(x, y, w, h) {
        ctx.strokeRect(x - Camera.x, y - Camera.y, w * Camera.zoom, h * Camera.zoom);
    },


    /**
     * 
     * @param {*} text 
     * @param {*} x 
     * @param {*} y 
     * @param {*} mw 
     */
    fillText: function fillText(text, x, y, mw) {
        ctx.fillText(text, x - Camera.x, y - Camera.y, mw * Camera.zoom);
    }
}, _defineProperty(_Renderer, "fillText", function fillText(text, x, y) {
    ctx.fillText(text, x - Camera.x, y - Camera.y);
}), _defineProperty(_Renderer, "drawBoxImage", function drawBoxImage(img, box, sx, xy, sw, sh, dx, dy, dw, dh) {
    ctx.drawImage(img, sx, xy, sw, sh, (dx - Camera.x - box.width / 2) * Camera.zoom, (dy - Camera.y - box.height / 2) * Camera.zoom, dw * Camera.zoom, dh * Camera.zoom);
}), _defineProperty(_Renderer, "drawShapeBoundingBox", function drawShapeBoundingBox(box, x, y, w, h) {
    ctx.strokeStyle = 'green';
    ctx.strokeRect((x - Camera.x - box.width / 2) * Camera.zoom, (y - Camera.y - box.height / 2) * Camera.zoom, w, h * Camera.zoom);
}), _defineProperty(_Renderer, "drawPositionBox", function drawPositionBox(font, box, x, y) {
    ctx.font = font;
    ctx.fillText("(" + (x - Camera.x - box.width / 2) + ", " + (y - Camera.y - box.height / 2) + ")", x - Camera.x - box.width / 2, y - Camera.y - box.height / 2);
}), _Renderer);
"use strict";

/**
 * check for es6 support and basic setup
 */

window.requestAnimationFrame = window.requestAnimationFrame // Standard name
|| window.webkitRequestAnimationFrame // Fallback to webkit- (old versions of Chrome or Safari)
|| window.mozRequestAnimationFrame // Fallback to moz- (Mozilla Firefox)
|| false;
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Wall = function () {
    function Wall() {
        _classCallCheck(this, Wall);

        this.body = new p2.Body({
            position: [0, 0],
            type: p2.Body.STATIC
        });

        this.shape = new p2.Box({
            width: 64,
            height: 64,
            collisionGroup: Constants.GROUP_WALL,
            collisionMask: Constants.GROUP_ENEMY | Constants.GROUP_PLAYER
        });
    }

    _createClass(Wall, [{
        key: "update",
        value: function update() {}
    }, {
        key: "draw",
        value: function draw() {
            Renderer.fillBoxRect(this.shape);
        }
    }, {
        key: "getX",
        value: function getX() {
            return this.body.position[0];
        }
    }, {
        key: "getY",
        value: function getY() {
            return this.body.position[1];
        }
    }, {
        key: "setX",
        value: function setX(x) {
            this.body.position[0] = x;
        }
    }, {
        key: "setY",
        value: function setY(y) {
            this.body.position[1] = y;
        }
    }, {
        key: "getWidth",
        value: function getWidth() {
            return this.shape.width;
        }
    }, {
        key: "getHeight",
        value: function getHeight() {
            return this.shape.height;
        }
    }, {
        key: "setWidth",
        value: function setWidth(w) {
            this.shape.width = w;
        }
    }, {
        key: "setHeight",
        value: function setHeight(h) {
            this.shape.height = h;
        }
    }]);

    return Wall;
}();
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Enemy = function Enemy() {
  _classCallCheck(this, Enemy);
};
"use strict";

/**
 * 
 * @name MEC - MeleeEnemyConstants
 * 
 * since there are going to be lots of the same type of variety of enemy, 
 * we will just have a "cookie cutter" object with all the necessary pieces of data
 * 
 */
var MEC = {

    leftY: 64,
    rightY: 192,
    upY: 0,
    downY: 128,

    spr_width: 64,
    spr_height: 64,

    dt: 0,

    maxcf: 6,

    velocity_max: 10,
    velocity_decay: 1.01,

    isloaded: false,

    img: new Image(),

    init: function init() {
        MEC.img.src = "src/assets/img/raider.png";
        MEC.img.onload = MEC.onload;
    },

    onload: function onload() {
        console.log("loaded melee enemy sprite");
        MEC.isloaded = true;
    }

};
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MeleeEnemy = function (_Enemy) {
    _inherits(MeleeEnemy, _Enemy);

    function MeleeEnemy(x, y, spd) {
        _classCallCheck(this, MeleeEnemy);

        var _this = _possibleConstructorReturn(this, (MeleeEnemy.__proto__ || Object.getPrototypeOf(MeleeEnemy)).call(this));

        _this.spd = spd;
        _this.velocity_spd = _this.spd / 100;

        _this.cf = 0;

        _this.direction = 0;

        setInterval(function () {

            if (_this.cf == MEC.maxcf) {
                _this.cf = 0;
            } else {
                _this.cf++;
            }
        }, MEC.dt);

        // physics

        _this.body = new p2.Body({
            position: [x, y],
            mass: 5,
            type: p2.Body.DYNAMIC,
            angle: 0
        });

        _this.shape = new p2.Box({
            width: 128,
            height: 128,
            collisionGroup: Constants.GROUP_ENEMY,
            collisionMask: Constants.GROUP_PLAYER | Constants.GROUP_WALL
        });

        _this.body.addShape(_this.shape);
        return _this;
    }

    _createClass(MeleeEnemy, [{
        key: "getKeyFrame",
        value: function getKeyFrame() {

            if (player.getX() < this.getX()) {
                this.previousY = this.leftY;
                return MEC.leftY;
            }
            if (player.getX() > this.getX()) {
                this.previousY = this.rightY;
                return MEC.rightY;
            }
            if (player.getY() < this.getY()) {
                this.previousY = this.upY;
                return MEC.upY;
            }
            if (player.getY() > this.getY()) {
                this.previousY = this.downY;
                return MEC.downY;
            }

            return this.previousY;
        }
    }, {
        key: "update",
        value: function update() {

            if (player.getX() >= this.getX()) {
                this.setX(this.getX() + this.spd);
            }
            if (player.getX() <= this.getX()) {
                this.setX(this.getX() - this.spd);
            }
            if (player.getY() >= this.getY()) {
                this.setY(this.getY() + this.spd);
            }
            if (player.getY() <= this.getY()) {
                this.setY(this.getY() - this.spd);
            }
        }
    }, {
        key: "draw",
        value: function draw() {
            Renderer.drawImage(MEC.img, MEC.spr_width * this.cf, this.getKeyFrame(), MEC.spr_width, MEC.spr_height, this.getX() - this.getWidth() / 2, this.getY() - this.getHeight() / 2, this.getWidth(), this.getHeight());
        }
    }, {
        key: "drawBoundingBox",
        value: function drawBoundingBox() {

            Renderer.drawShapeBoundingBox(this.shape, this.getX(), this.getY(), this.getWidth(), this.getHeight());
        }
    }, {
        key: "drawPosition",
        value: function drawPosition() {
            ctx.fillStyle = "blue";
            Renderer.fillRect(this.getX(), this.getY(), 5, 5);
            ctx.fillStyle = "black";
        }
    }, {
        key: "getX",
        value: function getX() {
            return this.body.position[0];
        }
    }, {
        key: "getY",
        value: function getY() {
            return this.body.position[1];
        }
    }, {
        key: "setX",
        value: function setX(x) {
            this.body.position[0] = x;
        }
    }, {
        key: "setY",
        value: function setY(y) {
            this.body.position[1] = y;
        }
    }, {
        key: "getWidth",
        value: function getWidth() {
            return this.shape.width;
        }
    }, {
        key: "getHeight",
        value: function getHeight() {
            return this.shape.height;
        }
    }]);

    return MeleeEnemy;
}(Enemy);
