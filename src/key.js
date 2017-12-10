class Key {

    constructor() {
        this.img = new Image();
    }

    /**
     * return a new promise that resolves the given image also passing back a load time
     * load also sets the this.type and this.src members
     * 
     * @param {String} src 
     * @param {Number} type 
     */
    load(src, type) {

        let start = Date.now();
        this.type = type;

        if (src && this.type != KeyConstants.EMPTY) {

            this.img.src = src;

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
}

/**
 * keys to all of the differant tiles that will be rendered in the mapLayout
 * 
 * ex: 
 * 0 - grass tile object, with all of characteristics of grass like its body
 */

let MapKey = [];