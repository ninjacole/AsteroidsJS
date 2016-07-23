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
        canvas = ASTEROIDS.canvas,
        context = ASTEROIDS.context,
        powerupSound = document.getElementById('powerupSound'),
        type = powerupTypes.RANDOM(),
        duration = 7000,
        spawnTime = Date.now(),
        ball0 = document.getElementById('ball0'),
        ball1 = document.getElementById('ball1'),
        ball2 = document.getElementById('ball2'),
        ballCounter = 0,
        ballIndex = 0,
        ballDir = 1,
        height = 32,
        width = 32,
        ballImgs = [ball0, ball1, ball2];
    
    this.isExpired = function () {
        return Date.now() - spawnTime > duration;
    };
    
    this.draw = function () {
        if (ballCounter === 0) {
            ballDir = 1;
        } else if (ballCounter === 25) {
            ballIndex = 0;
        } else if (ballCounter === 50) {
            ballIndex = 1;
        } else if (ballCounter === 75) {
            ballIndex = 2;
        } else if (ballCounter === 100) {
            ballDir = -1;
        }
        context.drawImage(ballImgs[ballIndex], x, y, width, height);
        ballCounter += ballDir;
    };
    
    this.getCircleCollider = function () {
        return {
            radius: width / 2,
            x: x + 0.5 * width,
            y: y + 0.5 * height
        };
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
    
    this.getType = function () {
        return type;
    };
    
    this.getWidth = function () {
        return width;
    };
    
    this.getHeight = function () {
        return height;
    };
    
    this.getCenterPoint = function () {
        var cx = x + 0.5 * width,
            cy = y + 0.5 * height;
        return {x: cx, y: cy};
    };
};

ASTEROIDS.PowerupMessage = function (type, x, y) {
    var powerupTypes = ASTEROIDS.powerupTypes,
        canvas = ASTEROIDS.canvas,
        context = ASTEROIDS.context,
        font = "15px Consolas",
        startTime = Date.now(),
        runningTime = 0,
        duration = 1500,
        message;

    this.draw = function () {
        runningTime = Date.now() - startTime;
        context.font = font;
        context.strokeStyle = 'white';
        context.strokeText(message, x, y);
    };
    
    this.timeExpired = function () {
        return runningTime > duration;
    };
    
    this.init = function () {
        if (type === powerupTypes.SPEED) {
            message = "Speed+!";
        } else if (type === powerupTypes.DOUBLE) {
            message = "Double gun!";
        } else if (type === powerupTypes.SPREAD) {
            message = "Spread gun!";
        } else if (type === powerupTypes.FIRE_RATE) {
            message = "Fire rate+!";
        } else if (type === powerupTypes.EXTRA_LIFE) {
            message = "Extra life!";
        } else if (type === powerupTypes.ENERGY) {
            message = "Energy+!";
        }
    };
    
    this.init();
};

ASTEROIDS.powerupTypes = (function () {
    var powerupTypes = {
        SPEED: 'speed',
        DOUBLE: 'double',
        SPREAD: 'spread',
        FIRE_RATE: 'fire rate',
        EXTRA_LIFE: 'extra life',
        ENERGY: 'energy',
        RANDOM: function () {
            var result = Math.random() * 60;
            if (result < 10) {
                return powerupTypes.SPEED;
            } else if (result < 20) {
                return powerupTypes.DOUBLE;
            } else if (result < 30) {
                return powerupTypes.SPREAD;
            } else if (result < 40) {
                return powerupTypes.FIRE_RATE;
            } else if (result < 50) {
                return powerupTypes.ENERGY;
            } else if (result < 60) {
                return powerupTypes.EXTRA_LIFE;
            }
        }
    };
    
    return powerupTypes;
}());