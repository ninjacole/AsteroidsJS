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

ASTEROIDS.utils = (function () {
    var canvas = document.getElementById('gameCanvas'),
        context = canvas.getContext('2d'),
        utils;
    utils = {
        convertDegreesToRads: function (degrees) {
            return (Math.PI / 180) * degrees;
        },
        getXChange: function (x, vx) {
            x += vx;
            if (x + vx > canvas.width) {
                x = 0;
            }
            if (x + vx < 0) {
                x = canvas.width;
            }
            return x;
        },
        getYChange: function (y, vy) {
            y += vy;
            if (y + vy > canvas.height) {
                y = 0;
            }
            if (y + vy < 0) {
                y = canvas.height;
            }
            return y;
        },
        getSpawnPoint: function () {
            var x = Math.random() > 0.5 ? 200 : canvas.width - 200,
                y = Math.random() > 0.5 ? 200 : canvas.height - 200;
            return {x: x, y: y};
        }
    };
    return utils;
}());