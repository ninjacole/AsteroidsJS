/*jslint node: true */
'use strict';

// global object reference or creation
var ASTEROIDS = ASTEROIDS || {};

ASTEROIDS.namespace('ASTEROIDS.ScoreMessage');

ASTEROIDS.ScoreMessage = function (amount, position) {
    var canvas = ASTEROIDS.canvas,
        context = ASTEROIDS.context,
        startTime = new Date().getTime(),
        runningTime = 0,
        duration = 1000,
        vy = -0.5;

    this.draw = function () {
        position.y += vy;
        runningTime = new Date().getTime() - startTime;
        context.save();
        context.font = "20px Consolas";
        context.fillStyle = 'white';
        context.fillText(amount, position.x, position.y);
        context.restore();
    };
    
    this.timeExpired = function () {
        return runningTime > duration;
    };
};