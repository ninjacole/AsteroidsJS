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
        radius = 16,
        powerupSound = document.getElementById('powerupSound'),
        canvas = document.getElementById('gameCanvas'),
        context = canvas.getContext('2d'),
        type = powerupTypes.RANDOM(),
        duration = 7000,
        spawnTime = new Date().getTime(),
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
        return new Date().getTime() - spawnTime > duration;
    };
    
    this.draw = function () {
        context.save();
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
        context.restore();
        ballCounter += ballDir;
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
        font = "15px Consolas",
        startTime = new Date().getTime(),
        runningTime = 0,
        duration = 1500,
        canvas = document.getElementById('gameCanvas'),
        context = canvas.getContext('2d'),
        message;

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
    
    this.init = function () {
        if (type === powerupTypes.SPEED) {
            message = "Speed+!";
        } else if (type === powerupTypes.DOUBLE) {
            message = "Double gun!";
        } else if (type === powerupTypes.SPREAD) {
            message = "Spread gun!";
        } else if (type === powerupTypes.FIRE_RATE) {
            message = "Fire rate+!";
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