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
    
            let key_src = [
                '',
                'src/assets/map/grass.png',
                'src/assets/map/wall.png'
            ];
    
            let key_isTerrain = [
                true,
                true,
                false
            ];
    
            for (let i = 0; i < key_src.length; i++) {
                MapKey[i] = new Key();
                assets[i+2] = MapKey[i].load(key_src[i], key_isTerrain[i]);
            }

            Promise.all(assets).then((times) => {
                console.log('loaded assets: ' + times.reduce((a, b) => a + b, 0) + ' ms');
                this.isLoaded = true;
            }).catch(() => {
                throw new Error('LOADING ERROR: could not load assets');
            });

            this.isLoaded = true;

        } catch (err) {
            console.log(err);
            this.isLoaded = false;
        }
    }
}