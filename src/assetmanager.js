class AssetManager {

    constructor() {
        this.isLoaded = false;
    }

    loadAssets() {

        console.log('loading assets...');
        let start = Date.now();


        try {

            let assets = [];
            assets[0] = mec_default.load();
            assets[1] = player.load();
            
            // images that correspond to a number in key_type
            let key_src = [
                '', // reserved: empty tile
                'src/assets/map/grass.png', // reserved: spawn point
                'src/assets/map/grass.png',
                'src/assets/map/wall.png',
                'src/assets/map/animated.png'
            ];
    
            // define type of tile based on key given
            let key_type = [
                KeyConstants.EMPTY, // reserved: empty tile
                KeyConstants.SPAWN, // reserved: spawn point
                KeyConstants.TERRAIN,
                KeyConstants.WALL,
                KeyConstants.ANIMATED
            ];

            /*
            key - pair
            type - src

            the key will also determine certain attributes
            */
    
            for (let i = 0; i < key_src.length; i++) {
                MapKey[i] = new Key();
                assets[i+2] = MapKey[i].load(key_src[i], key_type[i]);
            }

            Promise.all(assets).then((times) => {
                times = times.filter(function( element ) {
                    return element !== undefined;
                 });
                console.log('loaded assets: ' + times.reduce((a, b) => a + b, 0) + ' ms');
                this.isLoaded = true;
            }).catch((err) => {
                console.log('an error occured while trying to load assets');
                assets.forEach(asset => {
                    if(asset.state != 'fullfilled') {
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