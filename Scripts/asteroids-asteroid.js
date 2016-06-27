/*jslint node: true */
'use strict';

// global object reference or creation
var ASTEROIDS = ASTEROIDS || {};

ASTEROIDS.namespace('ASTEROIDS.Asteroid');

ASTEROIDS.Asteroid = function (config, previousImg) {
    var utils = ASTEROIDS.utils,
        x = config.x,
        y = config.y,
        vx = config.vx,
        vy = config.vy,
        spinFactor = config.spinFactor,
        size = config.size,
        rotation = 0,
        height = size * 25,
        width = size * 25,
        hitpoints = size,
        explosionSound = document.getElementById('explosionSound'),
        damageSound = document.getElementById('asteroid-takes-damage'),
        canvas = document.getElementById('gameCanvas'),
        context = canvas.getContext('2d'),
        aster1 = document.getElementById('aster1'),
        aster2 = document.getElementById('aster2'),
        img;
    
    this.rotate = function (degrees) {
        rotation += degrees;
        // If we're over 360 degrees, use the remainder
        // example: 365 % 360 = remainder of 5. Rotation is 5 degrees.
        if (rotation % 360 > 0) {
            rotation = rotation % 360;
        }

        // If we're negative rotation, add 360.
        // Example, rotated to -5 degrees, becomes 355 in the circle
        if (rotation < 0) {
            rotation = 360 + rotation;
        }
    };
    
    this.receiveDamage = function () {
        damageSound.play();
        hitpoints -= 1;
    };
    
    this.getHitpoints = function () {
        return hitpoints;
    };
    
    this.draw = function () {
        var centerx = x + 0.5 * width,
            centery = y + 0.5 * height;
        context.save();
        context.translate(centerx, centery);
        context.rotate(utils.convertDegreesToRads(rotation));
        context.translate(-1 * centerx, -1 * centery);
        context.drawImage(img, x, y, width, height);
        context.restore();
    };

    this.update = function () {
        x += vx;
        y += vy;
        this.rotate(spinFactor);
        if (x + vx > canvas.width) {
            x = 0;
        }
        if (x + vx < 0) {
            x = canvas.width;
        }
        if (y + vy > canvas.height) {
            y = 0;
        }
        if (y + vy < 0) {
            y = canvas.height;
        }
    };
    
    this.getImg = function () {
        return img;
    };
    
    this.getCenterX = function () {
        return x + 0.5 * width;
    };
    
    this.getCenterY = function () {
        return y + 0.5 * height;
    };
    
    this.getX = function () {
        return x;
    };
    
    this.getY = function () {
        return y;
    };
    
    this.getWidth = function () {
        return width;
    };
    
    this.playSound = function () {
        explosionSound.play();
    };
    
    this.getSize = function () {
        return size;
    };
    
    this.getVX = function () {
        return vx;
    };
    
    this.getVY = function () {
        return vy;
    };
    
    this.init = function () {
        if (previousImg) {
            img = previousImg;
        } else {
            img = Math.random() > 0.5 ? aster1 : aster2;
        }
    };
    
    this.init();
};