/*jslint node: true */
'use strict';

// global object reference or creation
var ASTEROIDS = ASTEROIDS || {};

ASTEROIDS.namespace('ASTEROIDS.Powerup');
ASTEROIDS.namespace('ASTEROIDS.PowerupMessage');

ASTEROIDS.Powerup = function (x, y, type) {
    // dependencies
    var radius = 20,
        pulse = 0.5,
        pulseChange = 0.5,
        powerupSound = document.getElementById('powerupSound'),
        canvas = document.getElementById('gameCanvas'),
        context = canvas.getContext('2d');
    
    
    this.getRadGrad = function () {
        if (pulse === radius - 1) {
            pulseChange = -1;
        } else if (pulse === 1) {
            pulseChange = 1;
        }
        
        pulse += pulseChange;

        var radgrad = context.createRadialGradient(x, y, 0, x, y, pulse);
        radgrad.addColorStop(0.5, '#C60F0F');
        radgrad.addColorStop(0.9, '#751F0E');
        
        return radgrad;
    };

    this.draw = function () {
        context.save();
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2, true);
        context.fillStyle = this.getRadGrad();
        context.fill();
        context.restore();
    };
};

ASTEROIDS.PowerupMessage = function (x, y, message) {
    var font = "15px Arial black",
        startTime = new Date().getTime(),
        runningTime = 0,
        duration = 1500,
        canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d');

    this.draw = function () {
        runningTime = new Date().getTime() - startTime;
        context.save();
        context.font = font;
        context.strokeText(message, x, y);
        context.restore();
    };
};