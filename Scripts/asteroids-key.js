/*jslint node: true */
'use strict';

// global object reference or creation
var ASTEROIDS = ASTEROIDS || {};

ASTEROIDS.namespace('ASTEROIDS.key');

ASTEROIDS.key = (function () {
    var key,
        pressed = {};
    
    key = {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        SPACE: 32,
        
        isDown: function (keyCode) {
            return pressed[keyCode];
        },
        onKeyDown: function (event) {
            pressed[event.keyCode] = event;
        },
        onKeyUp: function (event) {
            delete pressed[event.keyCode];
        }
    };
    
    
    document.addEventListener('keyup', function (event) { key.onKeyUp(event); }, false);
    document.addEventListener('keydown', function (event) { key.onKeyDown(event); }, false);
    
    return key;
}());