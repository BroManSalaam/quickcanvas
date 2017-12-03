let canvas;
let canvas_map;
let canvas_player

let ctx;
let ctx_map;
let ctx_player;

let player;
let game;
let audio;

$(document).ready(function () {
    canvas = document.getElementById('main_canvas');
    ctx = document.getElementById('main_canvas').getContext('2d');
    
    canvas_player = document.getElementById('player_canvas');
    ctx_player = document.getElementById('player_canvas').getContext('2d');
    
    //canvas.style.display = 'h';
    
    ctx.font="14px Verdana";

    canvas.width = $(window).width();
    canvas.height = $(window).height();
    
    canvas_player.width = $(window).width();
    canvas_player.height = $(window).height();

    $("body").css("overflow", "hidden");

    audio = new AudioManager();

    game = new Game($(window).width(), $(window).height());

    //Camera.zoom(.5);

    player = new Player(10, 0, 10.5);

    game.start();
});




