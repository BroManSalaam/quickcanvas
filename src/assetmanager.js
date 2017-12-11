class AssetManager {

    constructor() {
        this.isLoaded = false;
    }

    loadAssets() {

        console.log('loading assets...');

        try {
            let assets = [];
            assets[0] = mec_default.load();
            assets[1] = player.load();
            //assets[2] = audio.load();

            // images that correspond to a number in key_type
            let key_src = [
                '', // reserved: empty tile
                'src/assets/map/spawn.png',
                'src/assets/map/asphalt1.png',
                'src/assets/map/asphalt2.png',
                'src/assets/map/concrete.png',
                'src/assets/map/grass.png',
                'src/assets/map/hutwall.png',
                'src/assets/map/safezone.png'
            ];

            // define type of tile based on key given
            let key_type = [
                KeyConstants.types.EMPTY,
                KeyConstants.types.SPAWN,
                KeyConstants.types.ASPHALT,
                KeyConstants.types.ASPHALT2,
                KeyConstants.types.CONCRETE,
                KeyConstants.types.GRASS,
                KeyConstants.types.HUTWALL,
                KeyConstants.types.SAFEZONE
            ];

            /*
            key - pair
            type - src

            the key will also determine certain attributes
            */

            if(key_src.length != key_type.length) {
                throw new Error('key_src and key_type are not the same size!');
            }

            // return a new promise that resolves the given image also passing back a load time
            // load also sets the this.type and this.src members
            for (let i = 0; i < key_src.length; i++) {
                MapKey[i] = new Key();
                assets[assets.length+i] = MapKey[i].load(key_src[i], key_type[i]);
            }

            Promise.all(assets).then((times) => {
                // remove undefined times
                times = times.filter(function (element) {
                    return element !== undefined;
                });
                // log sum of all times
                console.log('loaded assets: ' + times.reduce((a, b) => a + b, 0) + ' ms');
                this.isLoaded = true;
            }).catch((err) => {
                console.log('an error occured while trying to load assets');
                assets.forEach(asset => {
                    if (asset.state != 'fullfilled') {
                        console.log(JSON.stringify(asset, null, ' ') + ' has not been fullfilled');
                    }
                });
                console.log(assets);
                throw err;
            });

            this.isLoaded = true;

        } catch (err) {
            console.log(err);
            this.isLoaded = false;
        }
    }
}