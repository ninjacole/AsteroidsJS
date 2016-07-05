/*jslint node: true */
'use strict';

// global object reference or creation
var ASTEROIDS = ASTEROIDS || {};

ASTEROIDS.namespace('ASTEROIDS.EnemyBullet');

ASTEROIDS.EnemyBullet = function EnemyBullet(x, y, playerx, playery) {
    var canvas = ASTEROIDS.canvas,
        context = ASTEROIDS.context,
        speed = 5,
        vx,
        vy,
        radius = 5,
        angle;
    
    function init() {
        var dx = playerx - x,
            dy = playery - y,
            angle = Math.atan2(-dy, dx);

        if (angle < 0) {
            angle += Math.PI * 2;
        }

        angle = angle * 180 / Math.PI;
        angle += 180;
        
        vx = Math.cos(Math.PI / 180 * (180 - angle)) * speed;
        vy = Math.sin(Math.PI / 180 * (180 - angle)) * speed;
    }
    
    init();
          
    this.draw = function () {
        context.save();
        context.fillStyle = 'red';
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
        context.closePath();
        context.restore();
    };
    
    this.update = function () {
        x += vx;
        y += vy;
    };
    
    this.canTravel = function () {
        if ((x < canvas.width && x > 0) && (y < canvas.height && y > 0)) {
            return true;
        }
        return false;
    };
    
    this.getCircleCollider = function () {
        return {
            radius: radius,
            x: this.getCenterX(),
            y: this.getCenterY()
        };
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