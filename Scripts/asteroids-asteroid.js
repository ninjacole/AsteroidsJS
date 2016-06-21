/*jslint node: true */
'use strict';

// global object reference or creation
var ASTEROIDS = ASTEROIDS || {};

ASTEROIDS.namespace('ASTEROIDS.Asteroid');

ASTEROIDS.Asteroid = function (config) {
    var utils = ASTEROIDS.utils,
        x = config.x,
        y = config.y,
        vx = config.vx,
        vy = config.vy,
        spinFactor = config.spinFactor,
        size = config.size,
        rotation = 0,
        height = size * 15,
        width = size * 15,
        explosionSound = document.getElementById('explosionSound'),
        canvas = document.getElementById('gameCanvas'),
        context = canvas.getContext('2d');
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
    
    this.draw = function () {
        context.save();
        context.translate(x, y);
        context.rotate(utils.convertDegreesToRads(rotation));
        context.fillRect(-0.5 * width, -0.5 * height, width, height);
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
};