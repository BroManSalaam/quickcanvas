let canvas;
let canvas_map;

let ctx;
let ctx_map;

let player;
let game;
let audio;

$(document).ready(function () {
    canvas = document.getElementById('main_canvas');
    ctx = document.getElementById('main_canvas').getContext('2d');
    ctx.font="14px Verdana";

    canvas.width = $(window).width();
    canvas.height = $(window).height();

    $("body").css("overflow", "hidden");

    audio = new AudioManager();
    //audio.music.menu.play();

     //Camera.zoom(.5, canvas.width, canvas.height);

    game = new Game($(window).width(), $(window).height());

    player = new Player(10, 0, 5.5);

    game.start();
});




