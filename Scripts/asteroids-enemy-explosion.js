/*jslint node: true */
'use strict';

// global object reference or creation
var ASTEROIDS = ASTEROIDS || {};

ASTEROIDS.namespace('ASTEROIDS.EnemyExplosion');

ASTEROIDS.EnemyExplosion = function (position) {
    var canvas = ASTEROIDS.canvas,
        context = ASTEROIDS.context,
        startTime = Date.now(),
        runningTime = 0,
        duration = 1000,
        img = document.getElementById('enemy-explosion');

    this.draw = function () {
        runningTime = Date.now() - startTime;
        context.save();
        context.drawImage(img, position.x, position.y);
        context.restore();
    };
    
    this.timeExpired = function () {
        return runningTime > duration;
    };
};