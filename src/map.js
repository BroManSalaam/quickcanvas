class Key {

    constructor() {
        this.img = new Image();
    }

    load(src, isTerrain) {

        let start = Date.now();

        if (!src) {
            this.img.src = 'src/assets/img/img_null.png'
        } else {
            this.img.src = src;
        }

        this.isTerrain = isTerrain;

        return new Promise((resolve, reject) => {
            this.img.onload = () => {
                resolve(Date.now() - start);
            }
            this.img.onerror = () => {
                reject();
            }
        });
    }
}

/**
 * keys to all of the differant tiles that will be rendered in the mapLayout
 * 
 * ex: 
 * 0 - grass tile object, with all of characteristics of grass like its body
 */

MapKey = [];