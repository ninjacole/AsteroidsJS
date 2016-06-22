/*jslint node: true */
'use strict';

// global object reference or creation
var ASTEROIDS = ASTEROIDS || {};

ASTEROIDS.namespace('ASTEROIDS.Bullet');

ASTEROIDS.Bullet = function (playerData, rotation, offset) {
    // dependencies
    var utils = ASTEROIDS.utils,
        // private variables
        duration = 700,
        startTime = new Date().getTime(),
        timeTravelled = 0,
        width = 5,
        height = 5,
        speed = 7,
        x = playerData.x,
        y = playerData.y,
        vx = playerData.vx,
        vy = playerData.vy,
        canvas = document.getElementById('gameCanvas'),
        context = canvas.getContext('2d'),
        img = document.getElementById('bullpng'),
        init = function () {
            vx += Math.sin(utils.convertDegreesToRads(180 - rotation)) * speed;
            vy += Math.cos(utils.convertDegreesToRads(180 - rotation)) * speed;
        };

    this.draw = function () {
        context.save();
//        context.fillStyle = "#3BFF6F";
        context.translate(x, y);
        context.rotate(utils.convertDegreesToRads(rotation));
        context.translate(-1 * x, -1 * y);
        context.drawImage(img, x + 0.5 * width, y + 0.5 * height);
//        context.beginPath();
//        if (offset < 0) {
//            context.arc(offset - width, -0.5 * height, 3, utils.convertDegreesToRads(0), utils.convertDegreesToRads(360));
//        } else if (offset > 0) {
//            context.arc(offset, -0.5 * height, 3, utils.convertDegreesToRads(0), utils.convertDegreesToRads(360));
//        } else {
//            context.arc(0, 0, 3, utils.convertDegreesToRads(0), utils.convertDegreesToRads(360));
//        }
//        context.fill();
//        context.closePath();

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
    
    this.getX = function () {
        return x;
    };
    
    this.getY = function () {
        return y;
    };
    
    this.getVX = function () {
        return vx;
    };
    
    this.getVY = function () {
        return vy;
    };
    
    this.getCenterX = function () {
        return x + 0.5 * width;
    };
    
    this.getCenterY = function () {
        return y + 0.5 * height;
    };
    
    this.getWidth = function () {
        return width;
    };

    init();
};