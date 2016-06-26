/*jslint node: true */
'use strict';

// global object reference or creation
var ASTEROIDS = ASTEROIDS || {};

ASTEROIDS.namespace('ASTEROIDS.Powerup');
ASTEROIDS.namespace('ASTEROIDS.PowerupMessage');
ASTEROIDS.namespace('ASTEROIDS.powerupTypes');


ASTEROIDS.Powerup = function (x, y) {
    // dependencies
    var powerupTypes = ASTEROIDS.powerupTypes,
        radius = 20,
        pulse = 0.5,
        pulseChange = 0.5,
        powerupSound = document.getElementById('powerupSound'),
        canvas = document.getElementById('gameCanvas'),
        context = canvas.getContext('2d'),
        type = powerupTypes.RANDOM();
    
    
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
    
    this.playSound = function () {
        powerupSound.play();
    };
    
    this.getX = function () {
        return x;
    };
    
    this.getY = function () {
        return y;
    };
    
    this.getRadius = function () {
        return radius;
    };
    
    this.getType = function () {
        return type;
    };
};

ASTEROIDS.PowerupMessage = function (x, y, message) {
    var font = "15px Consolas",
        startTime = new Date().getTime(),
        runningTime = 0,
        duration = 1500,
        canvas = document.getElementById('gameCanvas'),
        context = canvas.getContext('2d');

    this.draw = function () {
        runningTime = new Date().getTime() - startTime;
        context.save();
        context.font = font;
        context.strokeStyle = 'white';
        context.strokeText(message, x, y);
        context.restore();
    };
    
    this.timeExpired = function () {
        return runningTime > duration;
    };
};

ASTEROIDS.powerupTypes = (function () {
    var powerupTypes = {
        SPEED: 'speed',
        DOUBLE: 'double',
        SPREAD: 'spread',
        FIRE_RATE: 'fire rate',
        RANDOM: function () {
            var result = Math.random() * 40;
            if (result < 10) {
                return powerupTypes.SPEED;
            } else if (result < 20) {
                return powerupTypes.DOUBLE;
            } else if (result < 30) {
                return powerupTypes.SPREAD;
            } else if (result < 40) {
                return powerupTypes.FIRE_RATE;
            }
        }
    };
    
    return powerupTypes;
}());