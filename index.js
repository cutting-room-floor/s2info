#! /usr/bin/env node
var fs = require('fs');
var s2 = require('s2');
var split = require('split');
var through = require('through2');
var geojsonStream = require('geojson-stream');
var argv = require('minimist')(process.argv.slice(2));


if(!argv._.length) {
    return fs.createReadStream('USAGE.txt').pipe(process.stdout);
}

if (!process.stdin.isTTY) {
    process.stdin
        .pipe(split())
        .pipe(through.obj(function(token, enc, cb){
            //console.log(token, cellToGeoJSON(token, true))
            this.push(cellToGeoJSON(token, true));
            cb();
        }))
        .pipe(geojsonStream.stringify())
        .pipe(process.stdout);

} else if(argv._[0] === 'cell') {
    console.log(JSON.stringify(cellToGeoJSON(argv._[0], true), null, 4));
}

function cellToGeoJSON(token, props){
    if(props === undefined) props = true;

    var cellid = new s2.S2CellId().fromToken(token);
    var cell = new s2.S2Cell(cellid);

    var geojson = {
        type: "Feature",
        geometry: cell.toGeoJSON()
    };
    if(props) {
        geojson.properties = {
            id: cellid.toString(),
            token: cellid.toToken(),
            isface: cellid.isFace(),
            range: [cellid.rangeMin().toToken(), cellid.rangeMax().toToken()],
            point: cellid.toPoint().toString(),
            latLng: new s2.S2LatLng(cellid.toPoint()).toString(),
            face: cell.face(),
            level: cell.level(),
            orientation: cell.orientation(),
            area: cell.exactArea()
        };
    }
    return geojson;
}
