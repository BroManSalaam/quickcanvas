/**
 * 
 * @name MEC - MeleeEnemyConstants
 * 
 * since there are going to be lots of the same type of variety of enemy, 
 * we will just have a "cookie cutter" object with all the necessary pieces of data
 * 
 */
let MEC = {

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

    init: () => {
        MEC.img.src = "src/assets/spritesheets/raider.png";
        MEC.img.onload = MEC.onload;
    },

    onload: () => {
        console.log("loaded melee enemy sprite");
        MEC.isloaded = true;
    }

};