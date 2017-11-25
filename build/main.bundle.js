"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AnimatedTerrain = function (_Terrain) {
    _inherits(AnimatedTerrain, _Terrain);

    function AnimatedTerrain(key, x, y) {
        _classCallCheck(this, AnimatedTerrain);

        var _this = _possibleConstructorReturn(this, (AnimatedTerrain.__proto__ || Object.getPrototypeOf(AnimatedTerrain)).call(this, key, x, y));

        _this.dt = 120;
        _this.cf = 0;
        _this.maxcf = 3;

        _this.loop = setInterval(function () {
            if (_this.cf > _this.maxcf) {
                _this.cf = 0;
            } else {
                _this.cf++;
            }
        }, _this.dt);
        return _this;
    }

    _createClass(AnimatedTerrain, [{
        key: "draw",
        value: function draw() {
            Renderer.drawImage(MapKey[this.key], 0, 0, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }]);

    return AnimatedTerrain;
}(Terrain);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AssetManager = function () {
    function AssetManager() {
        _classCallCheck(this, AssetManager);

        this.isLoaded = false;
    }

    _createClass(AssetManager, [{
        key: 'loadAssets',
        value: function loadAssets() {
            var _this = this;

            console.log('loading assets...');
            var start = Date.now();

            try {

                var assets = [];
                assets[0] = mec_default.load();
                assets[1] = player.load();

                var key_src = ['', 'src/assets/map/grass.png', 'src/assets/map/wall.png'];

                var key_isTerrain = [true, true, false];

                for (var i = 0; i < key_src.length; i++) {
                    MapKey[i] = new Key();
                    assets[i + 2] = MapKey[i].load(key_src[i], key_isTerrain[i]);
                }

                Promise.all(assets).then(function (times) {
                    console.log('loaded assets: ' + times.reduce(function (a, b) {
                        return a + b;
                    }, 0) + ' ms');
                    _this.isLoaded = true;
                }).catch(function () {
                    throw new Error('LOADING ERROR: could not load assets');
                });

                this.isLoaded = true;
            } catch (err) {
                console.log(err);
                this.isLoaded = false;
            }
        }
    }]);

    return AssetManager;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AudioManager = function () {
  function AudioManager() {
    _classCallCheck(this, AudioManager);

    // effects or quick noises
    this.sounds = {
      0: new Audio('src/assets/audio/sounds/grenade.mp3')
    };

    // game music
    this.music = {
      0: new Audio('src/assets/audio/music/menu.mp3'),
      1: new Audio('src/assets/audio/music/heman.mp3')
    };

    // List of actively playing music (excludes sounds)
    this.activeMusic = [];
  }

  /**
   * Plays the audio (music) of the given name. This method
   * is preferred as it will check to make sure that the audio
   * has been fully loaded into memory.
   * 
   * @param {string} name
   * The name of the desired music audio file
   */


  _createClass(AudioManager, [{
    key: 'playMusic',
    value: function playMusic(name) {

      var audio = this.getAudioTrack(1, name);
      if (audio.readyState == 4) {

        // If the array already contains the audio file name, don't re-add it
        if (this.activeMusic.toString().indexOf(name) == -1) {
          audio.play();
          this.activeMusic.push(name);
        }
      } else {
        console.log("Audio (" + name + ") is not ready yet! Cannot play!");
      }
    }

    /**
     * This method will pause the music based on the given name provided.
     * If the audio file has not been loaded, it will print to the console
     * stating so. It will also remove the audio name from the activeMusic
     * array. NOTE: This does not reset the play-back cursor. When play() is
     * called on the same audio file, it will resume where it left off.
     * 
     * @param {string} name
     * The name of the audio file to pause
     */

  }, {
    key: 'pauseMusic',
    value: function pauseMusic(name) {

      var audio = this.getAudioTrack(1, name);
      var audioGroup = this.music;

      if (audio.readyState == 4) {

        audio.pause();
        // Remove it from the activeMusic array
        for (var a = 0; a < this.activeMusic.length; a++) {
          if (this.activeMusic[a] == name) {
            // Since the audio is paused, it is no longer active and
            // can be spliced to remove it from the array
            this.activeMusic.splice(a, 1);
          }
        }
      } else {
        console.log("Audio (" + name + ") is not ready yet! Cannot pause!");
      }
    }

    /**
     * Stops all of the music (not sound effects) playing and sets their
     * play-back cursor to the beginning. This means that when play() is called,
     * the audio will resume from the beginning of the track.
     */

  }, {
    key: 'stopAllMusic',
    value: function stopAllMusic() {

      var currentAudio = void 0;

      for (var a = 0; a < this.activeMusic.length; a++) {
        currentAudio = this.getAudioTrack(1, this.activeMusic[a]);
        currentAudio.pause();
        currentAudio.currentTime = 0; // Resets play-back to the beginning
      }
    }

    /**
     * Gets the audio track from the audio object based on the
     * name of the audio file ".../menu.mp3" and the string name
     * provided "menu". If there is a matching (non-case sensitive)
     * file to the string, it will return the audio object. If no matching
     * audio file was found, it will print a log statement and return
     * the audio file of the first index for the group (sound effects or
     * music)
     * 
     * @param {number} groupIndex
     * The group of the desired sound (sound effects = 0, music = 1)
     * @param {string} name
     * The name of the desired audio file ("menu")
     */

  }, {
    key: 'getAudioTrack',
    value: function getAudioTrack(groupIndex, name) {

      var audioName = ""; // For parsing stored audio names
      var group = groupIndex == 0 ? this.sounds : this.music;

      name = name.toLowerCase();

      for (var m = 0; m < Object.keys(group).length; m++) {

        // Isolate the end name of the file.      +1 to remove the /
        audioName = group[m].src.substring(group[m].src.lastIndexOf("/") + 1);
        // If the audio name contains the given name
        if (audioName.indexOf(name) == 0) {
          return group[m];
        }
      }

      console.log("Game music file not found for \"" + name + "\".");
      return group[0]; // To prevent errors
    }
  }]);

  return AudioManager;
}();
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Camera = _defineProperty({

    zoom: 1.0,
    x: 0,
    y: 0,

    xbias: 0,
    ybias: 0,

    oldscale: 1.0,

    move: function move(x, y) {
        Camera.x = x + Camera.xbias;
        Camera.y = y + Camera.ybias;
    },

    translate: function translate(xd, yd) {
        Camera.x += xd;
        Camera.y += yd;
    }

}, "zoom", function zoom(percent, w, h) {
    ctx.scale(percent, percent);
    var change = percent - Camera.oldscale;
    console.log(change);
    Camera.xbias = w * change;
    Camera.ybias = h * change;
});

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

        this.assetmanager = new AssetManager();

        this.screen_width = width;
        this.screen_height = height;

        this.enemy_melee = [];
        this.walls = [];

        this.enemy_melee.push(new MeleeEnemy(-600, -200, 30));
        this.enemy_melee.push(new MeleeEnemy(-300, -800, 30));
        this.enemy_melee.push(new MeleeEnemy(900, -300, 30));
        this.enemy_melee.push(new MeleeEnemy(-500, 400, 30));

        this.world = new p2.World({
            gravity: [0, 0]
        });

        this.world.on("beginContact", function (evt) {

            if (evt.shapeA instanceof Terrain) {}
        });

        this.states = Object.freeze({
            PLAYING: 0,
            MENU: 1
        });

        this.isPlaying = false;
        this.timeStep = 1 / 60;
    }

    _createClass(Game, [{
        key: "init",
        value: function init() {
            this.assetmanager.loadAssets();
            this.generateMap();
            this.addBodies();
        }
    }, {
        key: "start",
        value: function start() {
            var _this = this;

            this.init();

            // wait for required resources to load before launching
            this.load = setInterval(function () {

                if (_this.isReady()) {
                    _this.isPlaying = true;
                    clearInterval(_this.load);

                    bindInputHandler();

                    _this.currentstate = _this.states.PLAYING;

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

            // playing
            if (this.currentstate == this.states.PLAYING) {

                this.world.step(this.timeStep);

                player.update(this.dt);

                for (var i = 0; i < this.enemy_melee.length; i++) {
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
                    window.requestAnimationFrame(function () {
                        _this2.update();
                    });
                }
            }
        }
    }, {
        key: "render",
        value: function render() {
            // delta time
            this.dt = Date.now() - this.render_previous;
            this.render_previous = Date.now();

            Game.clearScreen();

            for (var r = 0; r < this.map.length; r++) {
                for (var c = 0; c < this.map[r].length; c++) {
                    if (this.map[r][c] == undefined) {
                        continue;
                    }

                    this.map[r][c].draw();
                }
            }
            player.draw();
            player.drawBoundingBox();

            Renderer.fillText("(0, 0)", 0, 0, 100);

            for (var i = 0; i < this.enemy_melee.length; i++) {
                this.enemy_melee[i].draw();
                this.enemy_melee[i].drawBoundingBox();
            }

            for (var _i = 0; _i < this.walls.length; _i++) {
                this.walls[_i].draw();
            }

            this.render_end = Date.now();
        }
    }, {
        key: "isReady",
        value: function isReady() {

            if (this.assetmanager.isLoaded) {
                return true;
            }
        }
    }, {
        key: "addBodies",
        value: function addBodies() {

            this.world.addBody(player.body);

            // add walls    
            for (var r = 0; r < this.map.length; r++) {
                for (var c = 0; c < this.map[r].length; c++) {

                    if (this.map[r][c] == undefined) {
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

            for (var i = 0; i < this.enemy_melee.length; i++) {
                this.world.addBody(this.enemy_melee[i].body);
            }
        }
    }, {
        key: "generateMap",
        value: function generateMap() {

            // original map that will be converted to terrain and walls though the map generator
            var mapLayout = [[2, 2, 2, 2], [2, 1, 2, 2], [1, 1, 2, 2], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1]];

            var chunk = [[0, 1, 1, 1], [1, 1, 1, 1], [1, 1, 0, 1], [1, 1, 1, 1]];

            //MapGenerator.pushChunk(mapLayout, chunk, 0);
            MapGenerator.appendChunk(mapLayout, chunk, 0);

            this.map = MapGenerator.generate(mapLayout);
        }
    }], [{
        key: "clearScreen",
        value: function clearScreen() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
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
var canvas_map = void 0;

var ctx = void 0;
var ctx_map = void 0;

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

    //Camera.zoom(.5, canvas.width, canvas.height);

    game = new Game($(window).width(), $(window).height());

    player = new Player(10, 0, 5.5);

    game.start();
});
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Key = function () {
    function Key() {
        _classCallCheck(this, Key);

        this.img = new Image();
    }

    _createClass(Key, [{
        key: 'load',
        value: function load(src, isTerrain) {
            var _this = this;

            var start = Date.now();

            if (!src) {
                this.img.src = 'src/assets/img/img_null.png';
            } else {
                this.img.src = src;
            }

            this.isTerrain = isTerrain;

            return new Promise(function (resolve, reject) {
                _this.img.onload = function () {
                    resolve(Date.now() - start);
                };
                _this.img.onerror = function () {
                    reject();
                };
            });
        }
    }]);

    return Key;
}();

/**
 * keys to all of the differant tiles that will be rendered in the mapLayout
 * 
 * ex: 
 * 0 - grass tile object, with all of characteristics of grass like its body
 */

MapKey = [];
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

MapConstants = {
    TILE_WIDTH: 66,
    TILE_HEIGHT: 66,
    x: 0,
    y: 0
};

var MapGenerator = function () {
    function MapGenerator() {
        _classCallCheck(this, MapGenerator);
    }

    _createClass(MapGenerator, null, [{
        key: 'generate',


        /**
         * 
         * @param {*} mapLayout 
         * @param {*} isChunked 
         */
        value: function generate(mapLayout, isChunked) {

            // create a copy of mapLayout to be filled with newly generated terrain
            var map = [mapLayout.length];
            for (var i = 0; i < mapLayout.length; i++) {
                map.push(new Array(mapLayout[i].length));
            }
            map.shift();

            console.log('generating ' + mapLayout.length + ' x ' + mapLayout[0].length + ' map...');
            for (var r = 0; r < mapLayout.length; r++) {
                for (var c = 0; c < mapLayout[r].length; c++) {

                    try {
                        if (mapLayout[r][c] == undefined || _typeof(mapLayout[r][c]) == undefined) {
                            continue;
                        }
                        // check for types
                        if (MapKey[mapLayout[r][c]].isTerrain) {
                            map[r][c] = new Terrain(mapLayout[r][c], c * MapConstants.TILE_WIDTH + MapConstants.x, r * MapConstants.TILE_HEIGHT + MapConstants.y);
                        } else {
                            map[r][c] = new Wall(mapLayout[r][c], c * MapConstants.TILE_WIDTH + MapConstants.x, r * MapConstants.TILE_HEIGHT + MapConstants.y, MapConstants.TILE_WIDTH, MapConstants.TILE_HEIGHT);
                        }
                    } catch (err) {
                        if (err instanceof TypeError) {
                            console.log('rdeg');
                        }
                    }
                }
            }

            return map;
        }

        /**
         * add a chunk to the right hand side of a map
         * 
         * @param {*Array} map map to append chunk to
         * @param {*Array} chunk chunk to be added to map
         * @param {*Number} row what row to insert chunk into
         * 
         * @default row will start at row 0
         */

    }, {
        key: 'appendChunk',
        value: function appendChunk(map, chunk, row) {

            for (var r = 0; r < map.length; r++) {
                map[r + row] = map[r + row].concat(chunk[r]);
            }
        }
    }, {
        key: 'pushChunk',
        value: function pushChunk(map, chunk, col) {

            if (col < 0) {
                throw new Error('pushChunk() cannot take a negative collumn index');
            }

            for (var i = 0; i < chunk.length; i++) {

                // if they specify a collumn, add undefined tiles until we reach that tile, then fill in the chunk for that index
                if (col > 0) {
                    var array = [];

                    for (var e = 0; e < col; e++) {
                        array[e] = undefined;
                    }
                    array = array.concat(chunk[i]);
                    map.push(array);
                } else {
                    map.push(chunk[i]);
                }
            }

            return map;
        }
    }]);

    return MapGenerator;
}();

;
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

        this.img = new Image();

        this.isLeft = false;
        this.isRight = false;
        this.isDown = false;
        this.isUp = false;

        // the position on the spritesheet where each directional frame starts eg: the down walking animation may start at 0
        this.leftY = 1184;
        this.rightY = 592;
        this.downY = 0;
        this.upY = 1846;
        this.previousY = 0;

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
            collisionMask: Constants.GROUP_ENEMY | Constants.GROUP_WALL
        });

        this.body.addShape(this.shape);
    }

    _createClass(Player, [{
        key: "load",
        value: function load() {
            var _this = this;

            return new Promise(function (resolve, reject) {

                var start = Date.now();
                _this.img.src = "src/assets/spritesheets/SpriteSheet.png";

                _this.img.onload = function () {
                    resolve(Date.now() - start);
                };
                _this.img.onerror = function () {
                    reject();
                };
            });
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
        value: function update(dt) {
            // scaling dt with velocity
            //let velocity_average = (Math.abs(this.body.velocity[0]) + Math.abs(this.body.velocity[1])) > 1 ? (Math.abs(this.body.velocity[0]) + Math.abs(this.body.velocity[1])) : 1;
            //this.dt = 250 / velocity_average < this.dt_max ? this.dt_max : 300 / velocity_average;

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

            // if left and not over max velocity
            if (this.isLeft && Math.abs(this.body.velocity[0]) < this.velocity_max) {

                if (this.velocity[0] > -this.velocity_start) {
                    this.setXVelocity(-this.velocity_start);
                }
                this.body.velocity[0] -= this.velocity_spd;
            }
            if (!this.isLeft && this.body.velocity[0] < 0) {
                this.body.velocity[0] /= this.velocity_decay;
            }

            if (this.isRight && this.body.velocity[0] < this.velocity_max) {

                if (this.velocity[0] < this.velocity_start) {
                    this.setXVelocity(this.velocity_start);
                }

                this.body.velocity[0] += this.velocity_spd;
            }
            if (!this.isRight && this.body.velocity[0] > 0) {
                this.body.velocity[0] /= this.velocity_decay;
            }

            if (this.isDown && this.body.velocity[1] < this.velocity_max) {
                if (this.velocity[1] < this.velocity_start) {
                    this.setYVelocity(this.velocity_start);
                }

                this.body.velocity[1] += this.velocity_spd;
            }
            if (!this.isDown && this.body.velocity[1] > 0) {
                this.body.velocity[1] /= this.velocity_decay;
            }

            if (this.isUp && Math.abs(this.body.velocity[1]) < this.velocity_max) {
                if (this.velocity[1] > -this.velocity_start) {
                    this.setYVelocity(-this.velocity_start);
                }
                this.body.velocity[1] -= this.velocity_spd;
            }
            if (!this.isUp && this.body.velocity[1] < 0) {
                this.body.velocity[1] /= this.velocity_decay;
            }
        }
    }, {
        key: "draw",
        value: function draw() {
            Renderer.drawBoxImage(this.img, this.shape, this.spr_width * this.cf, this.getKeyFrame(), this.spr_width, this.spr_height, this.x, this.y, this.getWidth(), this.getHeight());
        }
    }, {
        key: "drawBoundingBox",
        value: function drawBoundingBox() {
            Renderer.drawShapeBoundingBox(this.shape, this.x, this.y, this.getWidth(), this.getHeight());
        }
    }, {
        key: "setYVelocity",
        value: function setYVelocity(v) {
            this.velocity[1] = v;
        }
    }, {
        key: "setXVelocity",
        value: function setXVelocity(v) {
            this.velocity[0] = v;
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
    }, {
        key: "velocity",
        get: function get() {
            return this.body.velocity;
        }
    }, {
        key: "x",
        get: function get() {
            return this.body.position[0];
        }
    }, {
        key: "y",
        get: function get() {
            return this.body.position[1];
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
     * @param {*} sy 
     * @param {*} sw 
     * @param {*} sh 
     * @param {*} dx 
     * @param {*} dy 
     * @param {*} dw 
     * @param {*} dh 
     */
    drawImage: function drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh) {
        ctx.drawImage(img, sx, sy, sw, sh, dx - Camera.x, dy - Camera.y, dw, dh);
    },


    /**
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} w 
     * @param {*} h 
     */
    fillRect: function fillRect(x, y, w, h) {
        ctx.fillRect(x - Camera.x, y - Camera.y, w, h);
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
        ctx.fillRect(x - Camera.x - box.width / 2, y - Camera.y - box.height / 2, w, h);
    },


    /**
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} w 
     * @param {*} h 
     */
    rect: function rect(x, y, w, h) {
        ctx.strokeRect(x - Camera.x, y - Camera.y, w, h);
    },


    /**
     * 
     * @param {*} text 
     * @param {*} x 
     * @param {*} y 
     * @param {*} mw 
     */
    fillText: function fillText(text, x, y, mw) {
        ctx.fillText(text, x - Camera.x, y - Camera.y, mw);
    }
}, _defineProperty(_Renderer, "fillText", function fillText(text, x, y) {
    ctx.fillText(text, x - Camera.x, y - Camera.y);
}), _defineProperty(_Renderer, "drawBoxImage", function drawBoxImage(img, box, sx, xy, sw, sh, dx, dy, dw, dh) {
    ctx.drawImage(img, sx, xy, sw, sh, dx - Camera.x - box.width / 2, dy - Camera.y - box.height / 2, dw, dh);
}), _defineProperty(_Renderer, "drawShapeBoundingBox", function drawShapeBoundingBox(box, x, y, w, h) {
    ctx.strokeStyle = 'green';
    ctx.strokeRect(x - Camera.x - box.width / 2, y - Camera.y - box.height / 2, w, h);
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

/**
 * something in the world that has a sprite and maybe an animation but no body
 */
var Terrain = function () {
    function Terrain(key, x, y) {
        _classCallCheck(this, Terrain);

        this.key = key;

        this.x = x, this.y = y;
    }

    _createClass(Terrain, [{
        key: "draw",
        value: function draw() {
            Renderer.drawImage(MapKey[this.key].img, 0, 0, 64, 64, this.x - 32, this.y - 32, 64, 64);
        }
    }]);

    return Terrain;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Wall = function () {
    function Wall(key, x, y, w, h) {
        _classCallCheck(this, Wall);

        this.key = key;

        this.body = new p2.Body({
            position: [x, y],
            type: p2.Body.STATIC
        });

        this.shape = new p2.Box({
            width: w,
            height: h,
            collisionGroup: Constants.GROUP_WALL,
            collisionMask: Constants.GROUP_ENEMY | Constants.GROUP_PLAYER
        });

        this.body.addShape(this.shape);
    }

    _createClass(Wall, [{
        key: "update",
        value: function update() {}
    }, {
        key: "draw",
        value: function draw() {
            Renderer.drawBoxImage(MapKey[this.key].img, this.shape, 0, 0, this.width, this.height, this.x, this.y, this.width, this.width);
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
        key: "setWidth",
        value: function setWidth(w) {
            this.shape.width = w;
        }
    }, {
        key: "setHeight",
        value: function setHeight(h) {
            this.shape.height = h;
        }
    }, {
        key: "x",
        get: function get() {
            return this.body.position[0];
        }
    }, {
        key: "y",
        get: function get() {
            return this.body.position[1];
        }
    }, {
        key: "height",
        get: function get() {
            return this.shape.width;
        }
    }, {
        key: "width",
        get: function get() {
            return this.shape.height;
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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 
 * @name MeleeEnemyConstants - MeleeEnemyConstants
 * 
 * since there are going to be lots of the same type of variety of enemy; 
 * we will just have a "cookie cutter" object with all the necessary pieces of data
 * 
 */
var MeleeEnemyConstants = function () {
    function MeleeEnemyConstants() {
        _classCallCheck(this, MeleeEnemyConstants);

        this.leftY = 64;
        this.rightY = 192;
        this.upY = 0;
        this.downY = 128;

        this.spr_width = 64;
        this.spr_height = 64;

        this.dt = 200;

        this.maxcf = 6;

        this.velocity_start = 30;

        this.img = new Image();
    }

    _createClass(MeleeEnemyConstants, [{
        key: "load",
        value: function load() {
            var _this = this;

            return new Promise(function (resolve, reject) {

                var start = Date.now();
                _this.img.src = "src/assets/spritesheets/raider.png";

                _this.img.onload = function () {
                    resolve(Date.now() - start);
                };
                _this.img.onerror = function () {
                    reject();
                };
            });
        }
    }]);

    return MeleeEnemyConstants;
}();

;

var mec_default = new MeleeEnemyConstants();
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
        _this.dt_count = 0;

        _this.direction = 0;
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

            if (player.y < this.y) {
                this.previousY = this.upY;
                return mec_default.upY;
            }
            if (player.y > this.y) {
                this.previousY = this.downY;
                return mec_default.downY;
            }
            if (player.x < this.x) {
                this.previousY = this.leftY;
                return mec_default.leftY;
            }
            if (player.x > this.x) {
                this.previousY = this.rightY;
                return mec_default.rightY;
            }

            return this.previousY;
        }
    }, {
        key: "update",
        value: function update(dt) {
            // if we passed over the delta time, increment the frame count if we are not already at the max
            this.dt_count = (dt || 1 / 60) + (this.dt_count || 0);

            if (this.dt_count >= mec_default.dt) {

                if (this.cf < mec_default.maxcf) {
                    this.cf++;
                } else {
                    this.cf = 0;
                }

                this.dt_count = 0;
            }

            if (player.x >= this.x) {
                this.velocity[0] = mec_default.velocity_start;
            }
            if (player.x <= this.x) {
                this.velocity[0] = -mec_default.velocity_start;
            }
            if (player.y >= this.y) {
                this.velocity[1] = mec_default.velocity_start;
            }
            if (player.y <= this.y) {
                this.velocity[1] = -mec_default.velocity_start;
            }
        }
    }, {
        key: "draw",
        value: function draw() {
            Renderer.drawImage(mec_default.img, mec_default.spr_width * this.cf, this.getKeyFrame(), mec_default.spr_width, mec_default.spr_height, this.x - this.width / 2, this.y - this.width / 2, this.width, this.width);
        }
    }, {
        key: "drawBoundingBox",
        value: function drawBoundingBox() {
            Renderer.drawShapeBoundingBox(this.shape, this.x, this.y, this.width, this.width);
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
        key: "velocity",
        get: function get() {
            return this.body.velocity;
        }
    }, {
        key: "x",
        get: function get() {
            return this.body.position[0];
        }
    }, {
        key: "y",
        get: function get() {
            return this.body.position[1];
        }
    }, {
        key: "width",
        get: function get() {
            return this.shape.height;
        }
    }]);

    return MeleeEnemy;
}(Enemy);
