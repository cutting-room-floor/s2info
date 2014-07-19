#! /usr/bin/env node
var fs = require('fs');
var s2 = require('s2');
var argv = require('minimist')(process.argv.slice(2));


if(!argv._.length) {
    return fs.createReadStream('USAGE.txt').pipe(process.stdout);
}


if(argv._[0] === 'cell') {

    var cellid = new s2.S2CellId().fromToken(argv._[1]);
    var cell = new s2.S2Cell(cellid);

    var info = cell.toGeoJSON();
    info.properties = {
        'id':cellid.toString(),
        'token': cellid.toToken(),
        'isface': cellid.isFace(),
        'range': [cellid.rangeMin().toToken(), cellid.rangeMax().toToken()],
        'point': cellid.toPoint().toString(),
        'latLng': new s2.S2LatLng(cellid.toPoint()).toString(),
        'face': cell.face(),
        'level': cell.level(),
        'orientation': cell.orientation(),
        'area': cell.exactArea()
    };

    console.log(JSON.stringify(info, null, 4));
}
