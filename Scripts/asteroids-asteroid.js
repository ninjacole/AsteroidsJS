/*jslint node: true */
'use strict';

// global object reference or creation
var ASTEROIDS = ASTEROIDS || {};

ASTEROIDS.namespace('ASTEROIDS.Asteroid');

ASTEROIDS.Asteroid = function (config) {
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
        that = this,
        img;
    
    that.getCircleCollider = function () {
        return {
            radius: width / 2,
            x: that.getCenterX(),
            y: that.getCenterY()
        };
    };
    
    that.rotate = function (degrees) {
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
    
    that.receiveDamage = function () {
        damageSound.play();
        hitpoints -= 1;
        img = grayImages[hitpoints - 1];
    };
    
    that.getHitpoints = function () {
        return hitpoints;
    };
    
    that.getCenterX = function () {
        return x + 0.5 * width;
    };
    
    that.getCenterY = function () {
        return y + 0.5 * height;
    };
    
    that.draw = function () {
        context.save();
        context.translate(that.getCenterX(), that.getCenterY());
        context.rotate(utils.convertDegreesToRads(rotation));
        context.translate(-1 * that.getCenterX(), -1 * that.getCenterY());
        context.drawImage(img, x, y, width, height);
        context.restore();
    };

    that.update = function () {
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
    
    that.getImg = function () {
        return img;
    };
    
    that.getCenterX = function () {
        return x + 0.5 * width;
    };
    
    that.getCenterY = function () {
        return y + 0.5 * height;
    };
    
    that.getX = function () {
        return x;
    };
    
    that.getY = function () {
        return y;
    };
    
    that.getWidth = function () {
        return width;
    };
    
    that.playSound = function () {
        explosionSound.play();
    };
    
    that.getSize = function () {
        return size;
    };
    
    that.getVX = function () {
        return vx;
    };
    
    that.getVY = function () {
        return vy;
    };
    
    that.init = function () {
        img = grayImages[hitpoints - 1];
    };
    
    that.init();
};