/*jslint node: true */
'use strict';

// global object reference or creation
var ASTEROIDS = ASTEROIDS || {};

ASTEROIDS.namespace('ASTEROIDS.Bullet');

ASTEROIDS.Bullet = function (playerData, offset) {
    // dependencies
    var utils = ASTEROIDS.utils,
        // private variables
        duration = 700,
        startTime = new Date().getTime(),
        timeTravelled = 0,
        rotation = playerData.rotation,
        width = 6,
        height = 6,
        speed = 7,
        x = playerData.x,
        y = playerData.y,
        vx = playerData.vx,
        vy = playerData.vy,
        canvas = document.getElementById('gameCanvas'),
        context = canvas.getContext('2d'),
        init = function () {
            vx += Math.sin(utils.convertDegreesToRads(180 - rotation)) * speed;
            vy += Math.cos(utils.convertDegreesToRads(180 - rotation)) * speed;
        };

    this.draw = function () {
        context.save();
        context.translate(x, y);
        context.rotate(utils.convertDegreesToRads(rotation));
        if (offset < 0) {
            context.fillRect(offset - width, -0.5 * height, width, height);
        } else if (offset > 0) {
            context.fillRect(offset, -0.5 * height, width, height);
        } else {
            context.fillRect(0, 0, width, height);
        }

        context.restore();

        if (x + vx > canvas.width) {
            x = 0;
        } else if (x + vx < 0) {
            x = canvas.width;
        }

        if (y + vy > canvas.height) {
            y = 0;
        } else if (y + vy < 0) {
            y = canvas.height;
        }
    };

    this.update = function () {
        x += vx;
        y += vy;
        timeTravelled = new Date().getTime() - startTime;
    };
    
    this.canTravel = function () {
        return timeTravelled < duration;
    };

    init();
};