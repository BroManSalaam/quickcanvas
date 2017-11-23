class Key {

    constructor(id, src, isTerrain) {

        this.img = new Image();
        this.isTerrain = isTerrain;

        if (!src) {
            this.img.src = 'src/assets/img/img_null.png'
        } else {
            this.img.src = src;
        }
        this.img.onload = this.onload;
        this.id = id;
        this.isLoaded = false;
    }

    onload() {
        console.log('key: ' + this.id + ' loaded image');
        this.isLoaded = true;
    }
}

/**
 * keys to all of the differant tiles that will be rendered in the mapLayout
 * 
 * ex: 
 * 0 - grass tile object, with all of characteristics of grass like its body
 */

MapKey = [
    new Key(0, '', true),
    new Key(0, 'src/assets/map/grass.png', true),
    new Key(1, 'src/assets/map/wall.png', false)
];