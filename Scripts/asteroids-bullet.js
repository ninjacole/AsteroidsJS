/*jslint node: true */
'use strict';

// global object reference or creation
var ASTEROIDS = ASTEROIDS || {};

ASTEROIDS.namespace('ASTEROIDS.Bullet');

ASTEROIDS.Bullet = function (bulletPoint, playervx, playervy, playerRotation) {
    // dependencies
    var utils = ASTEROIDS.utils,
        // private variables
        duration = 700,
        startTime = new Date().getTime(),
        timeTravelled = 0,
        radius = 5,
        speed = 7,
        x = bulletPoint.x,
        y = bulletPoint.y,
        canvas = document.getElementById('gameCanvas'),
        context = canvas.getContext('2d'),
        rotation = playerRotation,
        vx = playervx + Math.sin(utils.convertDegreesToRads(180 - rotation)) * speed,
        vy = playervy + Math.cos(utils.convertDegreesToRads(180 - rotation)) * speed;
    console.log(vx + ", " + vy);
    
    this.draw = function () {
        context.save();
        context.fillStyle = "#3BFF6F";
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
        context.closePath();

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
        return x + radius;
    };
    
    this.getCenterY = function () {
        return y + radius;
    };
    
    this.getRadius = function () {
        return radius;
    };
};