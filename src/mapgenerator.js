let MapConstants = {
    TILE_WIDTH: 66,
    TILE_HEIGHT: 66,
    x: 0,
    y: 0
};

class MapGenerator {

    /**
     * 
     * @param {*} mapLayout 
     * @param {*} isChunked 
     */
    static generate(mapLayout, isChunked) {

        // create a copy of mapLayout to be filled with newly generated terrain
        let map = [mapLayout.length];
        for (let i = 0; i < mapLayout.length; i++) {
            map.push(new Array(mapLayout[i].length));
        }
        map.shift();

        console.log('generating ' + mapLayout.length + ' x ' + mapLayout[0].length + ' map...');
        for (let r = 0; r < mapLayout.length; r++) {
            for (let c = 0; c < mapLayout[r].length; c++) {

                try {
                    if (mapLayout[r][c] == undefined || typeof mapLayout[r][c] == undefined) {
                        continue;
                    }
                    // check for types
                    if (MapKey[mapLayout[r][c]].isTerrain) {
                        map[r][c] = new Terrain(mapLayout[r][c],
                            c * MapConstants.TILE_WIDTH + MapConstants.x, r * MapConstants.TILE_HEIGHT + MapConstants.y);
                    } else {
                        map[r][c] = new Wall(mapLayout[r][c], c * MapConstants.TILE_WIDTH + MapConstants.x, r * MapConstants.TILE_HEIGHT + MapConstants.y,
                            MapConstants.TILE_WIDTH, MapConstants.TILE_HEIGHT);
                    }

                } catch (err) {
                    if (err instanceof TypeError) {
                        console.log('rdeg');
                    }
                }
            }
        }

        return map
    }

    /**
     * add a chunk to the right hand side of a map
     * 
     * @param {*Array} map map to append chunk to
     * @param {*Array} chunk chunk to be added to map
     * @param {*Number} row what row to insert chunk into
     * 
     * @default row will start at row 0
     */
    static appendChunk(map, chunk, row) {

        for (let r = 0; r < map.length; r++) {
            map[r + row] = map[r + row].concat(chunk[r]);
        }
    }

    static pushChunk(map, chunk, col) {

        if (col < 0) {
            throw new Error('pushChunk() cannot take a negative collumn index');
        }

        for (let i = 0; i < chunk.length; i++) {

            // if they specify a collumn, add undefined tiles until we reach that tile, then fill in the chunk for that index
            if (col > 0) {
                let array = [];

                for (let e = 0; e < col; e++) {
                    array[e] = undefined;
                }
                array = array.concat(chunk[i]);
                map.push(array);

            } else {
                map.push(chunk[i]);
            }
        }

        return map;
    }
};