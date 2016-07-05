/*jslint node: true */
'use strict';

// global object reference or creation
var ASTEROIDS = ASTEROIDS || {};

ASTEROIDS.namespace('ASTEROIDS.Asteroid');

ASTEROIDS.Asteroid = function (config, previousImg) {
    var utils = ASTEROIDS.utils,
        canvas = ASTEROIDS.canvas,
        context = ASTEROIDS.context,
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
        gray = document.getElementById('aster-gray'),
        gray1dmg = document.getElementById('aster-gray-1dmg'),
        gray2dmg = document.getElementById('aster-gray-2dmg'),
        gray3dmg = document.getElementById('aster-gray-3dmg'),
        grayImages = [gray3dmg, gray2dmg, gray1dmg, gray],
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
        img = grayImages[hitpoints - 1];
    };
    
    this.getHitpoints = function () {
        return hitpoints;
    };
    
    this.getCenterX = function () {
        return x + 0.5 * width;
    };
    
    this.getCenterY = function () {
        return y + 0.5 * height;
    };
    
    this.draw = function () {
        context.save();
        context.translate(this.getCenterX(), this.getCenterY());
        context.rotate(utils.convertDegreesToRads(rotation));
        context.translate(-1 * this.getCenterX(), -1 * this.getCenterY());
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
        img = grayImages[hitpoints - 1];
    };
    
    this.init();
};