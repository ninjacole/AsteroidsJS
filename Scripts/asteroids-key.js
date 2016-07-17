/*jslint node: true */
'use strict';

// global object reference or creation
var ASTEROIDS = ASTEROIDS || {};

ASTEROIDS.namespace('ASTEROIDS.key');

ASTEROIDS.key = (function () {
    var key,
        pressed = {};
    
    key = {
        LEFT: {
            keyCode: 37,
            execute: function () { },
        },
        UP: {
            keyCode: 38,
            execute: function () { },
        },
        RIGHT: {
            keyCode: 39,
            execute: function () { },
        },
        DOWN: {
            keyCode: 40,
            execute: function () { },
        },
        SPACE: {
            keyCode: 32,
            execute: function () { },
        },
        ESC: {
            keyCode: 27,
            execute: function () { },
        },
        Q: {
            keyCode: 81,
            execute: function () { },
        },
        R: {
            keyCode: 82,
            execute: function () { },
        },
        E: {
            keyCode: 69,
            execute: function () { },
        },
        ENTER: {
            keyCode: 13,
            execute: function () { },
        },
        ONE: {
            keyCode: 49,
            execute: function () { },
        },
        TWO: {
            keyCode: 50,
            execute: function () { },
        },
        
        isDown: function (keyCode) {
            return pressed[keyCode];
        },
        onKeyDown: function (event) {
            pressed[event.keyCode] = event;
        },
        onKeyUp: function (event) {
            delete pressed[event.keyCode];
        },
        reset: function () {
            pressed = {};
        },
        bindAction: function (keyName, action, undoAction) {
            keyName.execute = action;
            keyName.undo = undoAction;
        }
    };
    
    
    document.addEventListener('keyup', function (event) { key.onKeyUp(event); }, false);
    document.addEventListener('keydown', function (event) { key.onKeyDown(event); }, false);
    
    return key;
}());