let tmx = require('tmx-parser');
let jsonfile = require('jsonfile')
let fs = require('fs');
let CircularJSON = require('circular-json');

tmx.parseFile('./assets/maps/test.tmx', function (err, map) {
    if (err) {
        throw err;
    }
    
    let data = {
    };

    for (const key in map) {
        if (map.hasOwnProperty(key)) {
            const element = map[key];
            data[key] = element;
        }
    }

    //let test = CircularJSON.parse(data);
    //console.log(test);
    console.log(data);

    fs.writeFile('hey.json', JSON.stringify(data.layers), 'utf-8', function (err) {
        if (err) return console.log(err);
        
        console.log('tmx file parsing success');
    });

});