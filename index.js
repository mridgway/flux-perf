require('babel/register');
var Benchtable = require('benchtable');
var Promise = require('es6-promise').Promise;

var Alt = require('./alt');
var Flux = require('./flux');
var Fluxible = require('./fluxible');
var Flummox = require('./flummox');

var assert = require('assert');

Promise.all([Alt.isomorphic(), Flux.isomorphic(), Fluxible.isomorphic(), Flummox.isomorphic()]).then(function (states) {
    assert.deepEqual(states[0], states[1]);
    assert.deepEqual(states[1], states[2]);
    assert.deepEqual(states[2], states[3]);

    var suite = new Benchtable();

    // add tests
    suite
        .addFunction('isomorphic', function(deferred, app) {
            app.isomorphic().then(function () {
                deferred.resolve();
            });
        }, {
            defer: true
        })
        .addFunction('singleton', function(deferred, app) {
            app.singleton().then(function () {
                deferred.resolve();
            });
        }, {
            defer: true
        })
        .addInput('Alt', [Alt])
        .addInput('Flux', [Flux])
        .addInput('Fluxible', [Fluxible])
        .addInput('Flummox', [Flummox])
        // add listeners
        .on('error', function (e) {
            throw e.target.error;
        })
        .on('cycle', function(event) {
            console.log(String(event.target));
        })
        .on('complete', function() {
            console.log(this.table.toString());
        })
        // run async
        .run({ async: true, defer: true});
}).catch(function (e) {
    console.log(e.stack || e);
});
