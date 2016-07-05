/*jslint node: true */
'use strict';

// global object
var ASTEROIDS = ASTEROIDS || {};

// util function for adding new namespaces
ASTEROIDS.namespace = function (ns_string) {
    var parts = ns_string.split('.'),
        parent = ASTEROIDS,
        i;
    
    // strip redundant leading global
    if (parts[0] === "ASTEROIDS") {
        parts = parts.slice(1);
    }
    
    for (i = 0; i < parts.length; i += 1) {
        // create a property if it doesn't exist
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};

ASTEROIDS.namespace('ASTEROIDS.utils');
ASTEROIDS.canvas = document.getElementById('gameCanvas');
ASTEROIDS.context = ASTEROIDS.canvas.getContext('2d');

ASTEROIDS.utils = (function () {
    var utils;
    
    utils = {
        convertDegreesToRads: function (degrees) {
            return (Math.PI / 180) * degrees;
        },
        getXChange: function (x, vx) {
            x += vx;
            if (x + vx > ASTEROIDS.canvas.width) {
                x = 0;
            }
            if (x + vx < 0) {
                x = ASTEROIDS.canvas.width;
            }
            return x;
        },
        getYChange: function (y, vy) {
            y += vy;
            if (y + vy > ASTEROIDS.canvas.height) {
                y = 0;
            }
            if (y + vy < 0) {
                y = ASTEROIDS.canvas.height;
            }
            return y;
        },
        getSpawnPoint: function () {
            var x = Math.random() > 0.5 ? 200 : ASTEROIDS.canvas.width - 200,
                y = Math.random() > 0.5 ? 200 : ASTEROIDS.canvas.height - 200;
            return {x: x, y: y};
        }
    };
    return utils;
}());