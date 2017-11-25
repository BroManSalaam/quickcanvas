/**
 * 
 * @name MeleeEnemyConstants - MeleeEnemyConstants
 * 
 * since there are going to be lots of the same type of variety of enemy; 
 * we will just have a "cookie cutter" object with all the necessary pieces of data
 * 
 */
class MeleeEnemyConstants {

    constructor() {

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

    load() {
        return new Promise((resolve, reject) => {

            let start = Date.now();
            this.img.src = "src/assets/spritesheets/raider.png";

            this.img.onload = () => {
                resolve(Date.now() - start);
            }
            this.img.onerror = () => {
                reject();
            }
        });
    }



};

let mec_default = new MeleeEnemyConstants();